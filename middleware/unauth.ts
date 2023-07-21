export default defineNuxtRouteMiddleware(async (to, from) => {
  let user = await useUser();
  const session = useClientSession();

  if (user && user.value) {
    console.log("Unauthenticated users only, redirecting...");
    return navigateTo(session.value.lastUrl || "/");
  } else {
    setTimeout(async () => {
      user = await useUser();
      if (user && user.value) {
        console.log("Unauthenticated users only, redirecting...");
        return navigateTo(session.value.lastUrl || "/");
      }
    }, 2000); // 2 seconds timeout
  }
});
