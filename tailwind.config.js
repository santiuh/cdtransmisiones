/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      // Colores puenteados a variables CSS para que el TEMA del editor (panel del
      // cliente) pueda pisarlos en runtime. El fallback es el hex original → sin
      // tema el sitio queda idéntico. El mapeo marca→--sms-* vive en el :root de
      // assets/css/tailwind.css. (Tailwind v3: los defaults van dentro de var()).
      colors: {
        primary: "var(--c-primary, #00679A)",
        secondary: "var(--c-secondary, #124660)",
        tertiary: "var(--c-tertiary, #F2F2F2)",
        background: "var(--c-background, #6090cd)",
        orange: "var(--c-orange, #E2762D)",
        orangelight: "var(--c-orangelight, #ff9046)",
      },
      fontFamily: {
        raleway: ["var(--sms-f-title, 'Libre Franklin')", "sans-serif"],
        notosans: ["var(--sms-f-text, 'Noto Sans')", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-shadow-sm": { textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" },
        ".text-shadow-md": { textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" },
        ".text-shadow-lg": { textShadow: "3px 3px 6px rgba(0, 0, 0, 0.6)" },
      });
    },
  ],
};
