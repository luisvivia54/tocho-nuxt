// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

  css: ['@/assets/css/theme.css'],

  runtimeConfig: {
    public: {
      // 🌐 Backend de la liga
      apiBase: 'http://tocho5-api.tochero5.mx/api',

      // 🔐 Config de Keycloak
      keycloakUrl: 'https://auth.tochero5.mx',
      keycloakRealm: 'tochero5',
      keycloakClientId: 'nuxt-app',
    },
  },

  // 👇 IMPORTANTE: dile a Nuxt que auto-importe composables de app/composables
  imports: {
    dirs: ['app/composables'],
  },

  compatibilityDate: '2025-11-22',
})
