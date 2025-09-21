/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1e40af" },     // blue-900
        secondary: { DEFAULT: "#059669" },   // emerald-600
        accent: { DEFAULT: "#dc2626" },      // red-600
        neutral: { DEFAULT: "#374151" },     // slate-700
        base: {
          100: "#ffffff",
          200: "#f8fafc",
          300: "#e2e8f0"
        }
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
      },
      borderRadius: {
        xl: "0.75rem"
      }
    }
  },
  plugins: []
};