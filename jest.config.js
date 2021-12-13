/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverage: false,
  roots: ['./tests'],
  clearMocks: true,
  setupFiles: ['./tests/setupTests.ts'],
  moduleNameMapper : {
    "^/opt/nodejs/(.*)$": "<rootDir>/src/myLayer/$1",
  }
};