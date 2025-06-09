/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          main: "#1976d2",
          light: "#4791db",
          dark: "#115293",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#dc004e",
          light: "#e33371",
          dark: "#9a0036",
          contrastText: "#ffffff",
        },
      },
      fontFamily: {
        sans: ['"Roboto"', '"Helvetica"', '"Arial"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
