import { type DocumentData } from "firebase/firestore";
import { type ClipData } from "utils/utils";

export const getUser = () => useState<any>("firebaseUser", () => null);

export const useClientSession = () =>
  useState<Record<string, any>>("session", () => {
    return {};
  });

export const getTwitchTokenData = () => useState<any>("twitchAccessToken", () => null)

export const getCachedClips = () => useState<Record<string, any>>("cachedClips", () => {return {}})