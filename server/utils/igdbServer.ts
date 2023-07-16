import {type H3Event} from "h3"

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

export const igdbHeaders = async (event: H3Event) => {
  const config = useRuntimeConfig();

  const eventContext = event.context;
  // first try event context
  let tokenData = eventContext.igdbToken;

  if (!tokenData || isTokenExpired(tokenData.expires)) {
    const res = await fetchNewToken();
    if (res && "access_token" in res) {
      tokenData = {
        token: res.access_token,
        expires: Math.floor(Date.now() / 1000) + res.expires_in,
      };
      eventContext.igdbToken = tokenData;
    } else {
      console.log("error getting twitch access token");
    }
  }
  return {
    "Client-ID": config.public.twitchDbClientId,
    Authorization: "Bearer " + tokenData.token,
  };
};
