export default defineEventHandler((event) => {
  const userCookie = getCookie(event, "userCookie");
  event.context.user = userCookie;
});
