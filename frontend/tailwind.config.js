/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          accent: "#80CBC4",
          "accent-darker": "#5f9792",
          "accent-lighter": "#a3dcd7",
        },
        charcoal: {
          dark: "#333333",
          DEFAULT: "#4a4a4a",
          light: "#666666",
        },
        warm: {
          gray: {
            light: "#F0F0F0",
            lighter: "#F5F5F5",
            DEFAULT: "#E5E5E5",
            dark: "#D4D4D4",
          },
        },
      },
    },
  },
  plugins: [],
};
