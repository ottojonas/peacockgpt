/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        body: {
          DEFAULT: "#111111",
          light: "#f0f0f0",
        },
        line: {
          DEFAULT: "#1e1e1e",
          light: "#e0e0e0",
        },
        item: {
          DEFAULT: "#181818",
          light: "#ffffff",
        },
        card: {
          DEFAULT: "#252527",
          light: "#f8f8f8",
        },
        brandWhite: {
          DEFAULT: "#FFFFFF",
          light: "#181818",
        },
        brandGray: {
          DEFAULT: "#737373",
          light: "#d3d3d3",
        },
        brandBlue: {
          DEFAULT: "#1a2cb8",
          light: "#a3b8ff",
        },
        brandOrange: {
          DEFAULT: "#cbbca6",
          light: "#f5e6d3",
        },
      },
    },
  },
  plugins: [],
};
