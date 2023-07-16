import { getDoc, doc, setDoc, type Firestore } from "firebase/firestore";

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

export const useTwitchToken = async () => {
  const tokenData = getTwitchTokenData();

  if (process.server) {
    // first try event context
    const eventContext = useRequestEvent().context;
    tokenData.value = eventContext.igdbToken;

    if (!tokenData.value || isTokenExpired(tokenData.value.expires)) {
      const res = await fetchNewToken();
      if (res && "access_token" in res) {
        tokenData.value = {
          token: res.access_token,
          expires: Math.floor(Date.now() / 1000) + res.expires_in,
        };
        // save to context
        eventContext.igdbToken = tokenData.value;
      } else {
        console.log("error getting twitch access token");
      }
    }
  } else {
    //   CLIENT SIDE
    const firestore = useNuxtApp().$firestore as Firestore;

    if (!tokenData.value) {
      // read token from Firestore if it exists and is not expired
      tokenData.value = (
        await getDoc(doc(firestore, "tokens", "twitchToken")).catch(() => null)
      )?.data();
    }

    if (!tokenData.value || isTokenExpired(tokenData.value.expires)) {
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
    }
  }

  return tokenData;
};

const getCompanies = async (ids: number[]) => {
    const res = await $csrfFetch("/api/igdb/search", {
        method: "POST",
        body: {
          query: query,
        },
      });

};

export const searchGames = async (query: string) => {
  const { $csrfFetch } = useNuxtApp();

  const res = await $csrfFetch("/api/igdb/search", {
    method: "POST",
    body: {
      query: query,
    },
  });

//   convert date
return res.map(game => {
    return {
      ...game,
      first_release_date: game.first_release_date ? new Date(game.first_release_date * 1000).getFullYear() : "?",
      companies: game.involved_companies.map(inv_comp => inv_comp.company.name)
    };
  });
};
