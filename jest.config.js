module.exports = {
  preset: 'ts-jest', // Use ts-jest to handle TypeScript
  testEnvironment: 'jest-environment-jsdom', // Simulates a browser environment for React
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'], // Optional setup file (see Step 3)
  // moduleNameMapper: {
  //   // Handle CSS imports (if your app imports styles)
  //   '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  // },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transform TS/TSX files
  },
};
