module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[cm]?[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!react-router|cookie-es/)",
  ],
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.js"],
  testPathIgnorePatterns: ["<rootDir>/e2e/"],
};
