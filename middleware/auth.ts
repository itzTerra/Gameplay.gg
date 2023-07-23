export default defineNuxtRouteMiddleware(async (to, from) => {
  let user = await useUser();

  if (!user || !user.value) {
    await delay(2000)
    if (!user || !user.value) {
        console.log("Authenticated users only, redirecting...");
        return navigateTo({
          path: "/login",
          query: {
            redirect: to.fullPath,
          },
        });
      }
  }
});
