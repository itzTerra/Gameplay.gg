// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ['~/assets/css/tailwind.css'],
  components: [
    { path: '~/components/svg', prefix: 'SVG' },
    '~/components'
  ],
  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],
  image: {
    format: ["avif", "webp", "jpg"],
    dir: 'assets/img'
  },
  colorMode: {
    dataValue: 'theme', // activate data-theme in <html> tag
    preference: 'system', // default value of $colorMode.preference
    fallback: 'dark', // fallback value if not system preference found
    classSuffix: '',
  },
  runtimeConfig: {
    // The private keys which are only available within server-side
    firebaseApiKey: "",
    // Keys within public, will be also exposed to the client-side
    public: {
    }
  }
})
