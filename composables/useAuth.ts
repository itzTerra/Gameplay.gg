//https://firebase.google.com/docs/auth/web/start

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  type UserCredential,
  type Auth,
} from "firebase/auth";

interface Response {
  credentials?: UserCredential | void;
  errorCode?: string;
  errorMessage?: string;
}

export default function () {
  const auth = useNuxtApp().$auth as Auth;
  const googleProvider = new GoogleAuthProvider();

  const createUser = async (email: string, password: string) => {
    let response: Response = {};

    response.credentials = await createUserWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        response.errorCode = error.code;
        response.errorMessage = error.message;
      });

    return response;
  };

  const loginUser = async (email: string, password: string) => {
    let response: Response = {};

    response.credentials = await signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        response.errorCode = error.code;
        response.errorMessage = error.message;
      });

    return response;
  };

  const loginUserGoogle = async () => {
    let response: Response = {};

    response.credentials = await signInWithPopup(auth, googleProvider)
      .catch((error) => {
        response.errorCode = error.code;
        response.errorMessage = error.message;
      });

      return response
  };

  const logoutUser = async () => {
    const result = await auth.signOut();
    return result;
  };

  return {
    createUser,
    loginUser,
    logoutUser,
    loginUserGoogle
  };
}
