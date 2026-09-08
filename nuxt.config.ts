export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxt/eslint"],

  css: [
    "@/assets/css/theme.css",
    "@/assets/css/liga-b.css",
  ],

  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
        },
      ],
    },
  },

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