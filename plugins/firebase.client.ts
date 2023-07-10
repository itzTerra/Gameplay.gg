import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { User } from "firebase/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
  console.log("FIREBASE CLIENT PLUGIN");

  const config = useRuntimeConfig();
  const { $csrfFetch } = nuxtApp;

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

  const updateUser = async (user: User | null) => {
    console.log("Updating user: ", JSON.stringify(user));

    const clientUser = await useUser();
    const clientSession = useClientSession();

    if (user) {
        const idToken = await getIdToken(user);
        clientUser.value = user;
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

  //   await updateUser(auth.currentUser)

  onAuthStateChanged(auth, async (user) => {
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log("AUTH STATE CHANGED");
    updateUser(user);
  });

  const firestore = getFirestore(app);
  nuxtApp.vueApp.provide("firestore", firestore);
  nuxtApp.provide("firestore", firestore);
});
