import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'


export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig()

    const firebaseConfig = {
        apiKey: "AIzaSyBe8MpZhdk49GOht1zR2hR_nXnmwbbpi1M",
        authDomain: "gameplay-gg-e1506.firebaseapp.com",
        projectId: "gameplay-gg-e1506",
        storageBucket: "gameplay-gg-e1506.appspot.com",
        messagingSenderId: "782980878935",
        appId: "1:782980878935:web:887ae58617a5033be40912",
        measurementId: "G-R24Z8RSE5V"
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth(app)
    const firestore = getFirestore(app)

    nuxtApp.vueApp.provide('auth', auth)
    nuxtApp.provide('auth', auth)

    nuxtApp.vueApp.provide('firestore', firestore)
    nuxtApp.provide('firestore', firestore)
})