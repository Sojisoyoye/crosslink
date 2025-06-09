import { TextEncoder } from "util";

// Polyfill for crypto for Node.js in test environment
global.crypto = require("crypto").webcrypto;

// Polyfill for TextEncoder only (TextDecoder is already available)
global.TextEncoder = TextEncoder;
