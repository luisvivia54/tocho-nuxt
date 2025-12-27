export default defineNuxtConfig({
  srcDir: 'app',

  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/theme.css'],

  runtimeConfig: {
    public: {
      apiBase: 'http://tocho5-api.tochero5.mx/api',
      keycloakUrl: 'https://auth.tochero5.mx',
      keycloakRealm: 'tochero5',
      keycloakClientId: 'nuxt-app',
    },
  },

  imports: {
    // OJO: ya NO va con "app/..." porque srcDir ya es app
    dirs: ['composables'],
  },

  compatibilityDate: '2025-11-22',
})
