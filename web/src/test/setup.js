import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
