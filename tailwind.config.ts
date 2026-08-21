import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#24366e",
        blue: "#5e749e",
        peach: "#eabfa8",
        mint: "#f0f5f6",
      },
      fontFamily: {
        sans: ["var(--font-sora)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      screens: {
        nav: "957px",
      },
      boxShadow: {
        card: "0 8px 20px rgba(36,54,110,0.08)",
        cardLg: "0 12px 30px rgba(36,54,110,0.08)",
        cta: "0 8px 20px rgba(36,54,110,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
