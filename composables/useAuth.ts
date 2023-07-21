//https://firebase.google.com/docs/auth/web/start

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail, 
  confirmPasswordReset,
  type UserCredential,
  type Auth,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  type Firestore,
  updateDoc,
} from "firebase/firestore";

// @ts-ignore
import blacklist from "the-big-username-blacklist";

interface Response {
  credentials?: UserCredential | void;
  errorCode?: string;
  username?: string;
}

export default async function () {
  const nuxtApp = useNuxtApp();
  const auth = nuxtApp.$auth as Auth;
  const firestoreClient = nuxtApp.$firestore as Firestore;
  const googleProvider = new GoogleAuthProvider();

  const clientUser = await useUser();

  const createUser = async (email: string, password: string) => {
    let response: Response = {};

    response.credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).catch((error) => {
      response.errorCode = error.code;
    });

    if (response.credentials) {
      // Create user entry in Firestore
      response.username = await createFirestoreUser(
        response.credentials.user.uid
      );

      // Update user state with firestore data
      const firestoreData = (
        await getDoc(
          doc(firestoreClient, "users", response.credentials.user.uid)
        ).catch(() => null)
      )?.data();
      console.log("Got Firestore user-data:", firestoreData);
      if (firestoreData) {
        clientUser.value = { ...clientUser.value, ...firestoreData };
      }
    }

    return response;
  };

  // @ts-nocheck
  const createFirestoreUser = async (uid: string) => {
    try {
      const username = generateUsername();
      await setDoc(doc(firestoreClient, "users", uid), {
        username: username,
        role: "user",
      });

      return username;
    } catch (e) {
      console.error("Error adding document: ", e);
      return "";
    }
  };

  const updateUsername = async (
    uid: string,
    username: string,
    validate = true
  ) => {
    if (validate && !blacklist.validate(username)) {
      throw new Error("Invalid username");
    }

    try {
      await updateDoc(doc(firestoreClient, "users", uid), {
        username: username,
      });
      return true; // Resolves with 'true' if the update is successful
    } catch (e) {
      console.error("Error updating document: ", e);
      throw new Error("Error updating document");
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
    });

    return response;
  };

  const loginUserGoogle = async () => {
    let response: Response = {};

    response.credentials = await signInWithPopup(auth, googleProvider).catch(
      (error) => {
        response.errorCode = error.code;
      }
    );

    return response;
  };

  const logoutUser = async () => {
    const result = await auth.signOut();
    return result;
  };

  const sendPassResetEmail = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email)
    } catch (error) {
        console.error(error)
    }
  }

  const confirmPassReset = async (code: string, newPassword: string) => {
    try {
        await confirmPasswordReset(auth, code, newPassword)
    } catch (error) {
        console.error(error)
    }
  }

  return {
    createUser,
    loginUser,
    logoutUser,
    loginUserGoogle,
    updateUsername,
    sendPassResetEmail,
    confirmPassReset
  };
}
