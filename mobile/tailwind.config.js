/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary Tokopedia Green Palette Tokens
        tokopedia: {
          green: "#00A86B",
          "green-dark": "#007D5A",
          "green-light": "#E3F6ED",
          ink: "#172522",
          "ink-soft": "#50645B",
          muted: "#71817C",
          line: "#E5ECE8",
          bg: "#F5F9F7",
          danger: "#D32F2F",
        },
        // Direct alias tokens
        brand: {
          DEFAULT: "#00A86B",
          dark: "#007D5A",
          light: "#E3F6ED",
        },
        ink: {
          DEFAULT: "#172522",
          soft: "#50645B",
        },
        danger: {
          DEFAULT: "#D32F2F",
        },
      },
    },
  },
  plugins: [],
};
