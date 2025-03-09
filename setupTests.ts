// Import jest-dom extensions
import '@testing-library/jest-dom';

// Simple declaration for global objects
declare global {
  interface Window {
    TextEncoder: any;
    TextDecoder: any;
    ResizeObserver: any;
  }
}

// Mock TextEncoder/TextDecoder
window.TextEncoder = class {
  encode(input?: string): Uint8Array {
    return new Uint8Array();
  }
};

window.TextDecoder = class {
  decode(input?: Uint8Array): string {
    return '';
  }
};

// Mock ResizeObserver for PriceChart
window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
