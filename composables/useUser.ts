import { getCookie } from "h3";

const getUserFromCookie = async (idToken: string) => {
  const res = await $fetch("/api/auth", {
    method: "GET",
    query: {
      idToken: idToken,
    },
  }).catch(() => null);

  return res;
};

export const useUser = async () => {
  const user = getUser();

  const cookieName = useRuntimeConfig().public.userCookieName;

  if ((!user || !user.value) && process.client) {
    const idToken = useCookie(cookieName).value;
    if (idToken) {
      user.value = await getUserFromCookie(idToken);
    }
  }

  if (process.server) {
    const event = useRequestEvent();
    if ("user" in event.context) {
      user.value = event.context.user;
    } else {
      const idToken = getCookie(event, cookieName);
      if (idToken) {
        user.value = await getUserFromCookie(idToken);
        event.context.user = user.value;
      }
    }
  }

  return user;
};
