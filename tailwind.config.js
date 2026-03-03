/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3c83f6",
        "primary-content": "#ffffff",
        "primary-light": "#eff6ff",
        "primary-foreground": "#ffffff",
        "background-light": "#f8fafc",
        "background-dark": "#0f172a",
        "card-light": "#ffffff",
        "card-dark": "#1e293b",
        "surface-light": "#f8fafc",
        "border-light": "#e2e8f0",
        "border-dark": "#334155",
        "text-primary": "#0f172a",
        "text-secondary": "#64748b",
        "text-main": "#0f172a",
        "text-muted": "#64748b",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1rem",
        full: "9999px"
      },
    },
  },
  plugins: [],
}
