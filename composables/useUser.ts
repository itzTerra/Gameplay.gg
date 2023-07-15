import {getCookie} from "h3"

export default async function () {
    const user = getUser();
  
    const cookieName = useRuntimeConfig().public.userCookieName;
  
    const getUserFromCookie = async (idToken: string) => {
      return await $fetch("/api/auth", {
          method: "GET",
          body: {
            idToken: idToken,
          },
        }).catch(() => null);
    }
  
    if ((!user || !user.value) && process.client) {
      const idToken = useCookie(cookieName).value;
      if (idToken) {
        user.value = await getUserFromCookie(idToken)
      }
    }
  
    if (process.server) {
      const event = useRequestEvent();
      if ("user" in event.context) {
        user.value = event.context.user;
      } else {
        const idToken = getCookie(event, cookieName);
        if (idToken) {
          user.value = await getUserFromCookie(idToken)
        }
      }
    }
  
    return user;
  }
  