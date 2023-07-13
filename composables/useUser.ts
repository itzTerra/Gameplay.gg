import { getCookie } from "h3";

export default async function () {
  const user = getUser();

  const cookieName = useRuntimeConfig().public.userCookieName;

  if ((!user || !user.value) && process.client) {
    const idToken = useCookie(cookieName).value;
    if (idToken) {
      user.value = await $fetch("/api/auth", {
        method: "GET",
        params: {
          idToken: idToken,
        },
      }).catch(() => null);
    }
  }

  if (process.server) {
    const event = useRequestEvent();
    if ("user" in event.context) {
      user.value = event.context.user;
    } else {
      const idToken = getCookie(event, cookieName);

      if (idToken) {
        user.value = await $fetch("/api/auth", {
          method: "GET",
          params: {
            idToken: idToken,
          },
        }).catch(() => null);
      }
    }
  }

  return user;
}
