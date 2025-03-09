// Define NodeJS namespace for TypeScript
declare namespace NodeJS {
  interface Timeout {}

  interface Global {
    TextEncoder: any;
    TextDecoder: any;
    ResizeObserver: any;
  }
}
