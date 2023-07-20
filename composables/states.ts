export const getUser = () => useState<any>("firebaseUser", () => null);

export const useClientSession = () =>
  useState<Record<string, any>>("session", () => {
    return {};
  });

export const getTwitchTokenData = () => useState<any>("twitchAccessToken", () => null)

export const getCachedClips = () => useState<any>("cachedClips", () => {return {}})