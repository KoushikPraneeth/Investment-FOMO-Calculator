/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
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
        dark: {
          bg: {
            primary: "#121212",
            secondary: "#1e1e1e",
            tertiary: "#2d2d2d",
          },
          text: {
            primary: "#e0e0e0",
            secondary: "#a0a0a0",
            accent: "#80CBC4",
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
    },
  },
  plugins: [],
};
