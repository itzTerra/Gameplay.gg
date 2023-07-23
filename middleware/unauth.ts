export default defineNuxtRouteMiddleware(async (to, from) => {
  let user = await useUser();
  const session = useClientSession();

  if (user && user.value) {
    console.log("Unauthenticated users only, redirecting...");
    return navigateTo(to.query.redirect || session.value.lastUrl || "/");
  } else {
    await delay(2000);
    if (user && user.value) {
      console.log("Unauthenticated users only, redirecting...");
      return navigateTo(to.query.redirect || session.value.lastUrl || "/");
    }
  }
});
