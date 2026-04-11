import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: { DEFAULT: "#FF5C00", light: "#FF7A2E", dark: "#CC4A00" },
        black:  { DEFAULT: "#080808" },
        surface: { DEFAULT: "#111111", 2: "#181818" },
        border:  { DEFAULT: "#1F1F1F", 2: "#2A2A2A" },
        white:   { DEFAULT: "#F8F8F8" },
        muted:   { DEFAULT: "#6B6B6B", 2: "#444444" },
      },
      fontFamily: {
        display: ['"Bebas Neue"', "Impact", "sans-serif"],
        body:    ['"Inter"', "system-ui", "sans-serif"],
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};
export default config;
