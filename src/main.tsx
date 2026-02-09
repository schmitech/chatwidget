import React, { StrictMode } from 'react'
import * as ReactDOM from 'react-dom'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Expose full React globals for the widget UMD bundle.
// Important: mutate the real ReactDOM namespace so Rollup/Vite can't
// tree-shake away internal fields (e.g. __DOM_INTERNALS...) that the
// widget's React build expects to exist at runtime.
const reactDomGlobals = ReactDOM as typeof ReactDOM & typeof import('react-dom/client');

if (!reactDomGlobals.createRoot) {
  reactDomGlobals.createRoot = createRoot;
}
if (!reactDomGlobals.hydrateRoot) {
  reactDomGlobals.hydrateRoot = hydrateRoot;
}

window.React = React;
window.ReactDOM = reactDomGlobals;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
