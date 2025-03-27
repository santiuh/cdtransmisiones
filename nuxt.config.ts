// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  compatibilityDate: "2024-11-01",
  css: ["~/assets/css/tailwind.css"],
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    "@nuxt/image",
    "nuxt-svgo",
    "nuxt-particles",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Raleway: {
            wght: [300, 400, 500, 600, 700, 800],
          },
          "Noto Sans": true, // Added Noto Sans
        },
      },
    ],
  ],
  svgo: {
    autoImportPath: "./public/svg",
  },
});
