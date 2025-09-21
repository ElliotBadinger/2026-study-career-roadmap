const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue[500],
        secondary: colors.emerald[500],
        accent: colors.red[500],
        info: colors.amber[500],
        
        // Light Mode
        "text-light-primary": colors.slate[800],
        "text-light-secondary": colors.slate[600],
        "bg-light-primary": colors.white,
        "bg-light-secondary": colors.slate[50],
        "border-light": colors.slate[200],

        // Dark Mode
        "text-dark-primary": colors.slate[200],
        "text-dark-secondary": colors.slate[400],
        "bg-dark-primary": colors.slate[900],
        "bg-dark-surface": colors.slate[800],
        "border-dark": colors.slate[700],
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        script: ["Dancing Script", "cursive"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        "focus-glow": `0 0 0 3px ${colors.blue[200]}`,
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(ellipse at top, var(--tw-gradient-stops))",
      },
      ringColor: {
        DEFAULT: colors.blue[600],
      },
      borderRadius: {
        xl: "0.75rem",
      },
    },
  },
  plugins: [],
};
