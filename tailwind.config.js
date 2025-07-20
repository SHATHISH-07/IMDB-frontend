/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlack: "#121212",
        customHover: "#3b82f6",
      },
      screens: {
        "custom-sm": "630px",
      },
    },
  },
};
