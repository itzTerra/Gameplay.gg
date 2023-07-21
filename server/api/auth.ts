import type { CookieOptions } from "#app";

export default defineEventHandler(async (event) => {
  const { req, res } = event.node;

  const config = useRuntimeConfig();

  if (req.method == "GET") {
    let user = null;
    const idToken = (await readBody(event)).idToken;

    if (idToken) {
      user = await adminAuth()
        .verifyIdToken(idToken)
        .catch(() => null);
    }

    console.log(idToken, user)

    return user;
  } else if (req.method == "POST") {
    // Add ID token to request context & create cookie
    const body = await readBody(event);
    const idToken = body.idToken;

    if (!idToken) {
      res.statusCode = 400;
      return "no ID token";
    }

    event.context.user = body.user;

    const cookieOptions: CookieOptions = { httpOnly: true, secure: true };
    if (body.rememberMe) {
      // Expires in 14 days
      cookieOptions.maxAge = 3600 * 24 * 14;
    }
    setCookie(event, config.public.userCookieName, idToken, cookieOptions);

    return "user updated";
  } else if (req.method == "DELETE") {
    event.context.user = null;

    deleteCookie(event, config.public.userCookieName);

    return "user deleted";
  }

  res.statusCode = 403;
  return "bad request";
});
