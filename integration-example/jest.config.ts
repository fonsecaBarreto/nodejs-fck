
export default {

  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: "coverage",

  roots: ['<rootDir>/tests', '<rootDir>/src'],
  
  testTimeout: 90000,

  transform: { '.+\\.ts$': 'ts-jest'},

  testEnvironment: 'node',

  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1'
  }
  
};
