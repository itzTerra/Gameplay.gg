export default defineNuxtRouteMiddleware(async (to, from) => {
  let user = await useUser();
  const session = useClientSession();

  if (user && user.value) {
    const where = to.query.redirect || session.value.lastUrl || "/"
    console.log("Unauthenticated users only, redirecting to", where);
    return navigateTo(where);
  } else {
    await delay(2000);
    const where = to.query.redirect || session.value.lastUrl || "/"
    if (user && user.value) {
      console.log("Unauthenticated users only, redirecting to", where);
      return navigateTo(where);
    }
  }
});
