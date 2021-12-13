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
    "^/opt/node_modules/(.*)$": "<rootDir>/src/myLayer/$1",
  }
};