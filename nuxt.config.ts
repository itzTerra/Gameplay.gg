// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["~/assets/css/tailwind.css"],
  components: [{ path: "~/components/svg", prefix: "SVG" }, "~/components"],
  routeRules: {
    // Homepage pre-rendered at build time
    '/': { prerender: true },
    // Product page generated on-demand, revalidates in background
    '/products/**': { swr: true },
    // Blog post generated on-demand once until next deploy
    '/blog/**': { isr: true },
    // Admin dashboard renders only on client-side
    '/game/**': { ssr: false },
    // Add cors headers on API routes
    // '/api/**': { cors: true },
    // Redirects legacy urls
    '/old-page': { redirect: '/new-page' }
  },
  runtimeConfig: {
    // The private keys which are only available within server-side
    // Keys within public, will be also exposed to the client-side
    public: {
        firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
        firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
        firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
        firebaseMeasurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
        userCookieName: "user_token",
        twitchDbClientId: process.env.NUXT_TWITCH_DB_CLIENT_ID,
        twitchDbClientSecret: process.env.NUXT_TWITCH_DB_CLIENT_SECRET,
    },
  },
  modules: [
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "nuxt-csurf",
  ],
  image: {
    format: ["avif", "webp", "jpg"],
    dir: "assets/img",
    domains: ['images.igdb.com']
  },
  colorMode: {
    dataValue: "theme", // activate data-theme in <html> tag
    preference: "system", // default value of $colorMode.preference
    fallback: "dark", // fallback value if not system preference found
    classSuffix: "",
  },
  csurf: {
    excludedUrls: [["/api/igdb/*", "i"], '/nocsrf1', ['/nocsrf2/.*', 'i']],
  } 
});
