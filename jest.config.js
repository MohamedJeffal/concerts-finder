module.exports = {
  collectCoverageFrom: ['src/**/*.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  resetModules: true,
  setupFilesAfterEnv: ['<rootDir>/test/setupJest.ts'],
  testMatch: ['<rootDir>/test/**/*.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
    '<rootDir>/test/setupJest.ts',
  ],
};
