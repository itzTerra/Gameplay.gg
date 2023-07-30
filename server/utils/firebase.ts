import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from "firebase-admin/auth"


// Get the Firebase Admin credentials from environment variables
const firebaseAdminCredentials = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);

export const firebaseAdminApp = initializeApp({
    credential: cert(firebaseAdminCredentials),
})

export const adminAuth = getAuth

export const firestore = getFirestore();