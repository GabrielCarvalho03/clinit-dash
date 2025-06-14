const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  collectCoverage: true,
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: [
    "src/**/*.{js,ts,jsx,tsx}",
    "!src/**/*.d.ts",
    "!**/node_modules/**",
    "!<rootDir>/src/pages/**",
    "!<rootDir>/src/**/index.{js,ts,jsx,tsx}",
  ],
  globals: {
    "ts-jest": {
      babelConfig: "./babel.config.test.js",
    },
  },
  coverageReporters: ["text", "lcov"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { babelConfig: true }],
  },
};

module.exports = createJestConfig(customJestConfig);
