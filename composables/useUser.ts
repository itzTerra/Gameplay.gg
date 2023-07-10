import { getCookie } from "h3";

export default async function () {
  const user = getUser();

  if (process.server) {
    const event = useRequestEvent();
    if ("user" in event.context) {
      user.value = event.context.user;
    } else {
      const idToken = getCookie(
        event,
        useRuntimeConfig().public.userCookieName
      );

      if (idToken) {
        user.value = await $fetch("/api/auth", {
          method: "GET",
          params: {
            idToken: idToken,
          },
        });
      }
    }
  }

  return user;
}
