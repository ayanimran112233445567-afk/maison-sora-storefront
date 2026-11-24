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
        canvas: "#FAF9F6",
        surface: "#F2EFEA",
        "surface-deep": "#E8E4DC",
        ink: "#111111",
        "ink-soft": "#3A3835",
        muted: "#706C64",
        hairline: "#E4E0D8",
        accent: "#8A7662",
        danger: "#9B3B2E",
      },
      fontFamily: {
        serif: [
          "var(--font-cormorant)",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
