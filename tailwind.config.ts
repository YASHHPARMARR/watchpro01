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
        primary: "#8B4A5C",
        gold: "#9A7A82",
        background: {
          light: "#F9F3F0",
          dark: "#2A1520",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        nav: ["var(--font-josefin)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
