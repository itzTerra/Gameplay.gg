import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();

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

  const { update: updateSession, overwrite: writeSession } = await useSession();
  console.log("FIREBASE CLIENT PLUGIN");

  //   await updateSession({ user: auth.currentUser });
  //   const session = useSessionData();
  //   session.value.user = auth.currentUser;

  //   const userCookie = useCookie("userCookie");
  onAuthStateChanged(auth, async (user) => {
    console.log("AUTH STATE CHANGED", user, JSON.stringify(user));
    await writeSession({ user: user });
    await updateSession({user:user})

    // session.value.user = user;

    // if (!user) {
    //   navigateTo("/");
    //   return;
    // }
    // https://firebase.google.com/docs/reference/js/firebase.User

    // const idToken = await getIdToken(user);
    // const response = await $fetch("/api/getCookie", {
    //   headers: new Headers({ Authorization: `Bearer ${idToken}` }),
    //   method: "POST",
    //   body: {
    //     user: user,
    //   },
    // });

    // @ts-ignore
    // userCookie.value = user; //ignore error because nuxt will serialize to json

    // This is so insecure no?
    // $fetch("/api/auth", {
    //   method: "POST",
    //   body: { user },
    // });
  });

  const firestore = getFirestore(app);
  nuxtApp.vueApp.provide("firestore", firestore);
  nuxtApp.provide("firestore", firestore);
});
