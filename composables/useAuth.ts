//https://firebase.google.com/docs/auth/web/start

import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  Auth,
  UserCredential,
} from "firebase/auth";

interface Response {
  credentials?: UserCredential;
  errorCode?: string;
  errorMessage?: string;
}

export default function () {
  const auth = useNuxtApp().$auth as Auth;
  const googleProvider = new GoogleAuthProvider();

  const getUser = () => useState<User | null>("firebaseUser", () => null);

  const createUser = async (email: string, password: string) => {
    let response: Response = {};

    createUserWithEmailAndPassword(auth, email, password)
      .then((credentials) => {
        response.credentials = credentials;
      })
      .catch((error) => {
        response.errorCode = error.code;
        response.errorMessage = error.message;
      });

    return response;
  };

  const loginUser = async (email: string, password: string) => {
    let response: Response = {};

    signInWithEmailAndPassword(auth, email, password)
      .then((credentials) => {
        response.credentials = credentials;
      })
      .catch((error) => {
        response.errorCode = error.code;
        response.errorMessage = error.message;
      });

    return response;
  };

  const loginUserGoogle = () => {
    let response: Response = {};

    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        response.credentials = result;
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        response.errorCode = error.code;
        response.errorMessage = error.message;
      });

      return response
  };

  const initUser = async () => {
    const firebaseUser = getUser();
    firebaseUser.value = auth.currentUser;

    const userCookie = useCookie("userCookie");

    const router = useRouter();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
      } else {
        //if signed out
        router.push("/");
      }

      firebaseUser.value = user;

      // @ts-ignore
      userCookie.value = user; //ignore error because nuxt will serialize to json

      $fetch("/api/auth", {
        method: "POST",
        body: { user },
      });
    });
  };

  const logoutUser = async () => {
    const result = await auth.signOut();
    return result;
  };

  return {
    getUser,
    createUser,
    loginUser,
    logoutUser,
    initUser,
    loginUserGoogle
  };
}
