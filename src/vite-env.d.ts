/// <reference types="vite/client" />

declare module "*.css";

// Injected by vite.config.ts `define` from package.json#version. Surfaced
// in src/composer/shell/StatusBar.tsx so the studio shows the running
// version honestly without a runtime fetch.
declare const __APP_VERSION__: string;
