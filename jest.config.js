/** @type {import('jest').Config} */
const config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['integration-test'],
};

module.exports = config;
