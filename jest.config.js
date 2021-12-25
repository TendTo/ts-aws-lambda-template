/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverage: false,
  roots: ['./tests'],
  clearMocks: true,
  setupFilesAfterEnv: ['./tests/setupTests.ts'],
  moduleNameMapper: {
    "^/opt/nodejs/(.*)$": "<rootDir>/src/dependencies/$1",
  }
};