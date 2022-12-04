module.exports = {
    roots: ['<rootDir>/src'],
    clearMocks: true,
    collectCoverageFrom: [
      '!<rootDir>/src/**/*.rest',
  
      // TypeScript
      '<rootDir>/src/**/*.ts',
      '!<rootDir>/src/**/*.mock.ts',
    ],
    collectCoverage: true,
    coverageDirectory: './coverage',
    coverageReporters: ['lcov', 'cobertura', 'text-summary'],
    reporters: ['default', 'jest-junit'],
    coverageProvider: 'v8',
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts', '**/*.test.ts'],
    transform: {
      '^.+\\.(ts)?$': 'ts-jest',
    },
    verbose: true,
    preset: 'ts-jest/presets/js-with-ts',
    transformIgnorePatterns: ['<rootDir>/(build|config|dist|node_modules|docker)/'],
    moduleFileExtensions: ['js', 'ts', 'json'],
    moduleDirectories: ['node_modules'],
  };
  