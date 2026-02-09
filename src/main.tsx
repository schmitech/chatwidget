import React, { StrictMode } from 'react'
import * as ReactDOM from 'react-dom'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Expose full React globals for the widget UMD bundle.
// React 19 has no UMD builds, so the widget depends on these globals.
// We merge react-dom/client exports (createRoot, hydrateRoot) into
// the ReactDOM global since the ESM react-dom entry doesn't include them.
window.React = React;
window.ReactDOM = { ...ReactDOM, createRoot, hydrateRoot };

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
