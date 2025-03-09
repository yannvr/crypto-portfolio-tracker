import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      // Add other jest-dom matchers as needed
    }
  }
}

// This export is needed to make this a module
export {};
