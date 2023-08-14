// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    "./runtimeConfig": "./runtimeConfig.browser"
  },
  ssr: false,
  vite: {
    define: {
      "window.global": {}
    }
  },
  runtimeConfig: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    ENDPOINT_SECRET: process.env.ENDPOINT_SECRET,
    public: {
      STRIPE_KEY: process.env.STRIPE_KEY
    }
  }
});
