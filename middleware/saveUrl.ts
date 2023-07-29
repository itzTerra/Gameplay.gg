export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  // console.log(`saving url "${to.path}" from middleware`);

  const session = useClientSession();
  session.value.lastUrl = to.path
});
