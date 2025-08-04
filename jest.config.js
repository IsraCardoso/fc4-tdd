module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  verbose: true,
  collectCoverage: false,
  maxWorkers: 1,
  testTimeout: 30000,
  silent: false,
  setupFilesAfterEnv: [],
};
