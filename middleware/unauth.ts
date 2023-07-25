const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default defineNuxtRouteMiddleware(async (to, from) => {
  let user = await useUser();
  const session = useClientSession();

  if (user && user.value) {
    const where = to.query.redirect || session.value.lastUrl || "/";
    console.log("Unauthenticated users only, redirecting to", where);
    return navigateTo(where);
  } else {
    await delay(2000);
    user = await useUser()
    const where = to.query.redirect || session.value.lastUrl || "/";
    console.log(where);
    if (user && user.value) {
      console.log("Unauthenticated users only, redirecting to", where);
      return navigateTo(where);
    }
  }
});
