declare module 'react/cjs/react.development.js' {
  export * from 'react';
  const React: typeof import('react');
  export default React;
}

declare module 'react-dom/cjs/react-dom.development.js' {
  import * as ReactDOM from 'react-dom';
  const ReactDomDev: typeof ReactDOM;
  export = ReactDomDev;
}
