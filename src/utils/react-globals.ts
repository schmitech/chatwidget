import React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot, hydrateRoot } from 'react-dom/client';

let initialized = false;

/**
 * Expose React and ReactDOM as window globals for the chatbot widget UMD bundle.
 *
 * React 19 no longer ships UMD builds, so the host application must provide
 * these globals. We use the app's own bundled React instance, which already has
 * all internal state initialised (via closures), so createRoot / hooks / etc.
 * work correctly even though the internals aren't visible as object properties.
 */
export function ensureWidgetReactGlobals(): Promise<void> {
  if (initialized || typeof window === 'undefined') {
    return Promise.resolve();
  }
  initialized = true;

  window.React = React;
  window.ReactDOM = Object.assign({}, ReactDOM, {
    createRoot,
    hydrateRoot,
  });

  return Promise.resolve();
}
