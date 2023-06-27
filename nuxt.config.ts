// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/image',
    '@sidebase/nuxt-auth',
    '@nuxtjs/tailwindcss'
  ],
  image: {
    format: ["avif", "webp", "jpg"],
    dir: 'assets/img'
  }
})
