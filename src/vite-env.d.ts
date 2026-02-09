/// <reference types="vite/client" />

declare module 'react-syntax-highlighter' {
  import type { ComponentType } from 'react';
  export const Prism: ComponentType<Record<string, unknown>>;
}

declare module 'react-syntax-highlighter/dist/esm/styles/hljs' {
  export const github: Record<string, unknown>;
}
