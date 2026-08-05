/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./App.jsx",
    "./App.js",
    "./index.ts",
    "./index.js",
    "./src/**/*.tsx",
    "./src/**/*.ts",
    "./src/**/*.jsx",
    "./src/**/*.js",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Flat hyphenated Tokopedia design tokens
        "tokopedia-green": "#00A86B",
        "tokopedia-green-dark": "#007D5A",
        "tokopedia-green-light": "#E3F6ED",
        "tokopedia-ink": "#172522",
        "tokopedia-ink-soft": "#50645B",
        "tokopedia-muted": "#71817C",
        "tokopedia-line": "#E5ECE8",
        "tokopedia-bg": "#F5F9F7",
        "tokopedia-danger": "#D32F2F",

        // Nested Tokopedia structure fallback
        tokopedia: {
          green: {
            DEFAULT: "#00A86B",
            dark: "#007D5A",
            light: "#E3F6ED",
          },
          ink: {
            DEFAULT: "#172522",
            soft: "#50645B",
          },
          muted: "#71817C",
          line: "#E5ECE8",
          bg: "#F5F9F7",
          danger: "#D32F2F",
        },
      },
    },
  },
  plugins: [],
};
