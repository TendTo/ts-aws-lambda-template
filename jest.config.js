/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverage: false,
  clearMocks: true,
  testMatch: ["**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)"],
  setupFiles: ['./__tests__/setupTests.ts'],
  moduleNameMapper: {
    "^/opt/nodejs/(.*)$": "<rootDir>/src/myLayer/$1",
  }
};