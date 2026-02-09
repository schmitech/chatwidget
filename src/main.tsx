import React, { StrictMode } from 'react'
import * as ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Expose React and ReactDOM as globals for the npm widget build.
// Window.React/ReactDOM are declared in src/types/widget.types.ts
window.React = React;
window.ReactDOM = ReactDOM;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
