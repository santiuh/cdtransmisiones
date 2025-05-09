// nuxt.config.ts
export default defineNuxtConfig({
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
          "Libre Franklin": true,
          "Noto Sans": true,
        },
      },
    ],
  ],
  svgo: {
    autoImportPath: "./public/svg",
  },
  plugins: [{ src: "~/plugins/aos.js", ssr: false }],
});
