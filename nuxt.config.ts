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
      "nuxt-mail",
      {
        message: {
          to: process.env.EMAIL_TO,
          from: "venta@imoberdorfhnos.com.ar",
        },
        smtp: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
      },
    ],
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          "Libre Franklin": true,
          "Noto Sans": true,
        },
      },
    ],
    "nuxt-mail",
  ],
  svgo: {
    autoImportPath: "./public/svg",
  },
});
