module.exports = {
    roots: ['<rootDir>/src'],
    clearMocks: true,
    collectCoverageFrom: [

      // TypeScript
      '<rootDir>/src/**/*.ts',
      '!<rootDir>/src/app.ts',
      '!<rootDir>/src/server.ts',
      '!<rootDir>/src/routes/**/*.ts',
      '!<rootDir>/src/graphql/**/*.ts',
      '!<rootDir>/src/**/index.ts',
      '!<rootDir>/src/**/*.lib.ts',
      '!<rootDir>/src/**/*.mock.ts',
      '!<rootDir>/src/**/*.skip.ts',
      '!<rootDir>/src/**/*.mock.js',
      '!<rootDir>/src/**/*.config.ts',
      '!<rootDir>/src/**/*.routes.ts',
      '!<rootDir>/src/**/*.schema.ts',
      '!<rootDir>/src/database/*',
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
  