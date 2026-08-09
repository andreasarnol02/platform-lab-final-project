/** @type {import('tailwindcss').Config} */
module.exports = {
  // Explicitly list all source file paths for Windows fast-glob compatibility
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
        // Flat hyphenated Storefront design tokens
        "storefront-green": "#00A86B",
        "storefront-green-dark": "#007D5A",
        "storefront-green-light": "#E3F6ED",
        "storefront-ink": "#172522",
        "storefront-ink-soft": "#50645B",
        "storefront-muted": "#71817C",
        "storefront-line": "#E5ECE8",
        "storefront-bg": "#F5F9F7",
        "storefront-danger": "#D32F2F",

        // Nested Storefront structure fallback
        storefront: {
          green: "#00A86B",
          greenDark: "#007D5A",
          greenLight: "#E3F6ED",
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
