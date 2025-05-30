module.exports = {
  preset: 'ts-jest', // Use ts-jest to handle TypeScript
  testEnvironment: 'jest-environment-jsdom', // Simulates a browser environment for React
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'], // Optional setup file (see Step 3)
  moduleDirectories: ['node_modules', '<rootDir>/src'], // Ensure Jest resolves from src
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transform TS/TSX files
  },
};
