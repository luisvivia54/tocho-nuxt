// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],

  // ✅ Carga tus estilos base + los de Lovable
  css: ["@/assets/css/theme.css"],

  // ✅ Usa el tailwind.config.ts que vas a crear en la raíz del proyecto
  tailwindcss: {
    configPath: "tailwind.config.ts",
  },

  runtimeConfig: {
    public: {
      // 🌐 Backend de la liga
      apiBase: "https://tocho5-api.tochero5.mx/api",

      // 🔐 Config de Keycloak
      keycloakUrl: "https://auth.tochero5.mx",
      keycloakRealm: "tochero5",
      keycloakClientId: "nuxt-app",
    },
  },

  // 👇 IMPORTANTE: dile a Nuxt que auto-importe composables de app/composables
  imports: {
    dirs: ["app/composables"],
  },

  compatibilityDate: "2025-11-22",
})