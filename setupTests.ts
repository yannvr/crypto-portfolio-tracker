import '@testing-library/jest-dom';
// Polyfill TextEncoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// used in PriceChart
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Load jest-dom
require('@testing-library/jest-dom');
