export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await useUser();

  if (!user || !user.value) {
    setTimeout(() => {
      if (!user || !user.value) {
        console.log("Authenticated users only, redirecting...");
        return navigateTo({
          path: "/login",
          query: {
            redirect: to.fullPath,
          },
        });
      }
    }, 2000);
  }
});
