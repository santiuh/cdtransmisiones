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
      colors: {
        primary: "#00579d",
        secondary: "#0071BC",
        tertiary: "#F2F2F2",
        background: "#6090cd",
        orange: "#E2762D",
        orangelight: "#ff9046",
      },
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
        notosans: ["Noto Sans", "sans-serif"],
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
