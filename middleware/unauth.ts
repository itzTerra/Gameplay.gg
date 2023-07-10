export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await useUser();

    if (user && user.value){
        console.log("Unauthenticated users only, redirecting...")
        const session = useClientSession()
        return navigateTo(session.value.lastUrl || "/")
    }
});
