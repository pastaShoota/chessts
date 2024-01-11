/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
    'utils/(.*)': '<rootDir>/src/utils/$1',
    'model/(.*)': '<rootDir>/src/model/$1',
    /*'test/(.*)': '<rootDir>/__test__/$1',*/
  },
};