import { type H3Event } from "h3";

const isTokenExpired = (expiry: number) => {
  let currentTime = Math.floor(Date.now() / 1000);
  return currentTime > expiry;
};

const fetchNewToken = async () => {
  const config = useRuntimeConfig();
  return $fetch<any>("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    params: {
      client_id: config.public.twitchDbClientId,
      client_secret: config.public.twitchDbClientSecret,
      grant_type: "client_credentials",
    },
  });
};

const getToken = async (event: H3Event | null) => {
  let tokenData;

  if (event) {
    // first try event context
    tokenData = event.context.igdbToken;
  }

  if (!tokenData) {
    // read token from Firestore if it exists and is not expired
    const ref = firestore.doc(`tokens/twitchToken`);
    const snapshot = await ref.get();
    tokenData = snapshot.data();

    if (event) {
      // save to context
      event.context.igdbToken = tokenData;
    }
  }

  if (!tokenData || isTokenExpired(tokenData.expires)) {
    const res = await fetchNewToken();
    if (res && "access_token" in res) {
      tokenData = {
        token: res.access_token,
        expires: Math.floor(Date.now() / 1000) + res.expires_in,
      };

      if (event) {
        // save to context
        event.context.igdbToken = tokenData;
      }

      // save to firestore
      await firestore.doc(`tokens/twitchToken`).set(tokenData);
    } else {
      console.log("error getting twitch access token");
    }
  }

  return tokenData.token
};

export const igdbHeaders = async (event: H3Event) => {
  const config = useRuntimeConfig();
  const token = await getToken(event)

  return {
    "Client-ID": config.public.twitchDbClientId,
    Authorization: "Bearer " + token,
  };
};
