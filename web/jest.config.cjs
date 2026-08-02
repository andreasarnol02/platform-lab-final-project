module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.js"],
  testPathIgnorePatterns: ["<rootDir>/e2e/"],
};
