import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import type { User } from "firebase/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
  console.log("FIREBASE CLIENT PLUGIN");

  const config = useRuntimeConfig();
  const $csrfFetch = nuxtApp.$csrfFetch;

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId,
    // apiKey: config.firebaseApiKey,
    // authDomain: config.firebaseAuthDomain,
    // projectId: config.firebaseProjectId,
    // storageBucket: config.firebaseStorageBucket,
    // messagingSenderId: config.firebaseMessagingSenderId,
    // appId: config.firebaseAppId,
    // measurementId: config.firebaseMeasurementId,
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  const auth = getAuth(app);
  nuxtApp.vueApp.provide("auth", auth);
  nuxtApp.provide("auth", auth);

  const firestore = getFirestore(app);
  nuxtApp.vueApp.provide("firestore", firestore);
  nuxtApp.provide("firestore", firestore);


  const updateUser = async (user: User | null) => {
    console.log("Updating user: ", JSON.stringify(user).slice(0, 40)+"...");

    const clientUser = await useUser();
    const clientSession = useClientSession();

    if (user) {
      const idToken = await getIdToken(user);

      // Get firestore user-data
      const firestoreData = (await getDoc(doc(firestore, "users", user.uid)).catch(()=>null))?.data()
      console.log("Got Firestore user-data:", firestoreData)
      if (firestoreData){
        clientUser.value = {...user, ...firestoreData}
      } else{
        clientUser.value = user;
      }

      $csrfFetch("/api/auth", {
        method: "POST",
        body: {
          idToken: idToken,
          rememberMe: clientSession.value.rememberMe || false,
          user: user,
        },
      });
    } else {
      clientUser.value = null;
      $csrfFetch("/api/auth", { method: "DELETE" });
    }
  };

  onAuthStateChanged(auth, async (user) => {
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log("AUTH STATE CHANGED");
    updateUser(user);
  });
});
