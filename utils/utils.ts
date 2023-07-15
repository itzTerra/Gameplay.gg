import {
  uniqueNamesGenerator,
  NumberDictionary,
  adjectives,
  animals,
} from "unique-names-generator";

export const generateUsername = () => {
  const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
  const generated_name = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, numberDictionary],
    separator: "",
    style: "capital",
  });

  return generated_name;
};

export enum UserRole {
  USER = 0,
  MODERATOR = 1,
  ADMIN = 2,
  OWNER = 3,
}

import { getDoc, doc, setDoc, type Firestore } from "firebase/firestore";

const CLIENT_ID = "vw0lga1mqhmvc1qv29igtgzejozlp7";
const CLIENT_SECRET = "30yn7mdyb90pj6m6fuuc3iupt8brh9";

const isTokenExpired = (expiry: number) => {
  let currentTime = Math.floor(Date.now() / 1000);
  return currentTime > expiry;
};

const fetchNewToken = async () => {
  return $fetch<any>("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    params: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "client_credentials",
    },
  });
};

export const useTwitchToken = async () => {
  const firestore = useNuxtApp().$firestore as Firestore;

  if (process.server) {
    const res = await fetchNewToken();

    if (res && "access_token" in res) {
      return ref({
        token: res.access_token,
        expires: Math.floor(Date.now() / 1000) + res.expires_in,
      });
    } else {
      console.log("error getting twitch access token");
      return ref(null)
    }
  }

  // read token from client state
  const tokenData = getTwitchTokenData();
  if (tokenData.value) {
    if (!isTokenExpired(tokenData.value.expires)) {
      return tokenData;
    }
  } else {
    // read token from Firestore if it exists and is not expired
    tokenData.value = (
      await getDoc(doc(firestore, "tokens", "twitchToken")).catch(() => null)
    )?.data();

    if (tokenData.value && !isTokenExpired(tokenData.value.expires)) {
      return tokenData;
    }
  }

  // if no token is stored, fetch a new one
  const res = await fetchNewToken();

  if (res && "access_token" in res) {
    tokenData.value = {
      token: res.access_token,
      expires: Math.floor(Date.now() / 1000) + res.expires_in,
    };

    //   save token to Firestore
    setDoc(doc(firestore, "tokens", "twitchToken"), tokenData.value);
  } else {
    console.log("error getting twitch access token");
  }

  return tokenData;
};
