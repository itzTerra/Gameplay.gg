// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["~/assets/css/tailwind.css"],
  components: [{ path: "~/components/svg", prefix: "SVG" }, "~/components"],
  runtimeConfig: {
    // The private keys which are only available within server-side
    // authApiKey: "",

    // Keys within public, will be also exposed to the client-side
    public: {
      //   firebaseApiKey: "",
      //   firebaseAuthDomain: "",
      //   firebaseProjectId: "",
      //   firebaseStorageBucket: "",
      //   firebaseMessagingSenderId: "",
      //   firebaseAppId: "",
      //   firebaseMeasurementId: "",
    },
  },
  modules: [
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "nuxt-vuefire",
  ],
  image: {
    format: ["avif", "webp", "jpg"],
    dir: "assets/img",
  },
  colorMode: {
    dataValue: "theme", // activate data-theme in <html> tag
    preference: "system", // default value of $colorMode.preference
    fallback: "dark", // fallback value if not system preference found
    classSuffix: "",
  },
  //   session: {
  //     // Module is enabled
  //     isEnabled: true,
  //     session: {
  //       // Sessions expire after 600 seconds = 10 minutes
  //       expiryInSeconds: 60 * 10,
  //       // Session ids are 64 characters long
  //       idLength: 64,
  //       // All session data is stored in a "sub-storage" that uses the `sessions` prefix
  //       storePrefix: "sessions",
  //       // The session cookie same site policy is `lax`
  //       cookieSameSite: "lax",
  //       // `Secure` attribute of session cookie is set to `true`
  //       cookieSecure: true,
  //       // `HttpOnly` attribute of session cookie is set to `true`
  //       cookieHttpOnly: true,
  //       // In-memory storage is used (these are `unjs/unstorage` options)
  //       storageOptions: {
  //         driver: "memory",
  //         options: {},
  //       },
  //       // The request-domain is strictly used for the cookie, no sub-domains allowed
  //       domain: false,
  //       // Sessions aren't pinned to the user's IP address
  //       ipPinning: false,
  //       // Expiration of the sessions are not reset to the original expiryInSeconds on every request
  //       rolling: false,
  //     },
  //     api: {
  //       // The API is enabled
  //       isEnabled: true,
  //       // `PATCH, GET, POST, DELETE /api/session` HTTP requests are possible
  //       methods: ["patch", "get", "post", "delete"],
  //       // The sessions endpoints are mounted at `/api/session`
  //       basePath: "/api/session",
  //     },
  //   },
  vuefire: {
    auth: true,
    config: {
      apiKey: process.env.NUXT_FIREBASE_API_KEY,
      authDomain: process.env.NUXT_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NUXT_FIREBASE_PROJECT_ID,
      appId: process.env.NUXT_FIREBASE_APP_ID,
      // there could be other properties depending on the project
    },
  },
});
