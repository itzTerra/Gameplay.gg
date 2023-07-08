export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return
    //   const session = useSessionData();
  const { update } = await useSession();
  
  await update({lastUrl: to.path});
  console.log(`saving url "${to.path}" from middleware`);
});
