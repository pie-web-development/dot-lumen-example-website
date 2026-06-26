/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2F5D50",
          deep: "#234638",
          light: "#3F7A6A",
        },
        paper: "#FAF8F5",
        elevated: "#F2EFE9",
        ink: "#1B2521",
        muted: "#5A6660",
        hairline: "#E0DDD5",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "65ch",
      },
    },
  },
};
