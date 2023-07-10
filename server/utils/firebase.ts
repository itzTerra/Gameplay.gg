import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from "firebase-admin/auth"

export const firebaseAdminApp = initializeApp({
    credential: cert("./service-account.json"),
})

export const adminAuth = getAuth

export const firestore = getFirestore();