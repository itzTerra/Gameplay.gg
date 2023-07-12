//https://firebase.google.com/docs/auth/web/start

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  type UserCredential,
  type Auth,
} from "firebase/auth";

import { collection, addDoc, type Firestore } from "firebase/firestore";

interface Response {
  credentials?: UserCredential | void;
  errorCode?: string;
  errorMessage?: string;
}

export default function () {
  const nuxtApp = useNuxtApp();
  const auth = nuxtApp.$auth as Auth;
  const googleProvider = new GoogleAuthProvider();

  const createUser = async (email: string, password: string) => {
    let response: Response = {};

    response.credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).catch((error) => {
      response.errorCode = error.code;
      response.errorMessage = error.message;
    });

    if (response.credentials) {
      // Create user entry in Firestore
      await createFirebaseUser(response.credentials.user.uid);
    }

    return response;
  };

  const createFirebaseUser = async (uid: string) => {
    try {
      await addDoc(collection(nuxtApp.$firestore as Firestore, "users"), {
        username: generateUsername(),
        perms: 0,
      });

      return true;
    } catch (e) {
      console.error("Error adding document: ", e);
      return false;
    }
  };

  const loginUser = async (email: string, password: string) => {
    let response: Response = {};

    response.credentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    ).catch((error) => {
      response.errorCode = error.code;
      response.errorMessage = error.message;
    });

    return response;
  };

  const loginUserGoogle = async () => {
    let response: Response = {};

    response.credentials = await signInWithPopup(auth, googleProvider).catch(
      (error) => {
        response.errorCode = error.code;
        response.errorMessage = error.message;
      }
    );

    return response;
  };

  const logoutUser = async () => {
    const result = await auth.signOut();
    return result;
  };

  return {
    createUser,
    loginUser,
    logoutUser,
    loginUserGoogle,
  };
}
