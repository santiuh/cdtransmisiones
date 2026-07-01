// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  // Integración con el panel/editor de Sol de Mayo Soft.
  runtimeConfig: {
    // Fallback webhook de rebuild (el principal es la API de Vercel del panel).
    revalidateToken: process.env.REVALIDATE_TOKEN || "",
    vercelDeployHook: process.env.VERCEL_DEPLOY_HOOK_URL || "",
    public: {
      smsApiBase: process.env.NUXT_PUBLIC_SMS_API_BASE || "https://soldemayosoft.com",
      smsSiteId:
        process.env.NUXT_PUBLIC_SMS_SITE_ID ||
        "b4fcde24-d4f5-4db2-87d7-522aa26f544a",
    },
  },
  // SSR puro (sin edge cache por path). El cache de Vercel/SWR indexa por path e
  // ignora el query, lo que rompía la vista previa del editor (?__smsPreview=…):
  // servía la home publicada cacheada. El endpoint central ya cachea el contenido
  // 5 min, así que el costo de origen es bajo. El publish refresca en ≤5 min.
  routeRules: {
    "/api/**": { index: false },
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: { lang: "es" },
      meta: [
        { property: "og:site_name", content: "Imoberdorf Hnos." },
        { property: "og:locale", content: "es_AR" },
        { property: "og:type", content: "website" },
        { name: "robots", content: "index, follow" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    },
  },
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
