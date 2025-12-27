export default defineNuxtConfig({
  srcDir: 'app',

  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/theme.css'],

  runtimeConfig: {
    public: {
<<<<<<< HEAD
      // 🌐 Backend de la liga
      apiBase: 'https://tocho5-api.tochero5.mx/api',

      // 🔐 Config de Keycloak
=======
      apiBase: 'http://tocho5-api.tochero5.mx/api',
>>>>>>> 529f021 (Cambios admin partidos + ajustes)
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
