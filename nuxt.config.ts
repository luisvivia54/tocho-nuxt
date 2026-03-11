export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],

  css: [
    "@/assets/css/theme.css",
    "@/assets/css/liga-b.css",
  ],

  tailwindcss: {
    configPath: "tailwind.config.ts",
  },

  runtimeConfig: {
    public: {
      apiBase: "https://tocho5-api.tochero5.mx/api",
      keycloakUrl: "https://auth.tochero5.mx",
      keycloakRealm: "tochero5",
      keycloakClientId: "nuxt-app",
    },
  },

  imports: {
    dirs: ["app/composables"],
  },

  compatibilityDate: "2025-11-22",
})