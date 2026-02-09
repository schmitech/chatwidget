import React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot, hydrateRoot } from 'react-dom/client';

const INTERNALS_KEY = '__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE';

type ReactDomWithClient = (typeof ReactDOM) & typeof import('react-dom/client');

let reactGlobalPromise: Promise<void> | null = null;

function attachClientExports(dom: object): ReactDomWithClient {
  const domWithClient = Object.create(
    Object.getPrototypeOf(dom),
    Object.getOwnPropertyDescriptors(dom),
  ) as ReactDomWithClient;

  domWithClient.createRoot ??= createRoot;
  domWithClient.hydrateRoot ??= hydrateRoot;
  return domWithClient;
}

async function loadDevReactBundles(): Promise<{
  react: typeof React;
  reactDom: ReactDomWithClient;
}> {
  const reactUrl = new URL('../../node_modules/react/cjs/react.development.js', import.meta.url);
  const reactDomUrl = new URL('../../node_modules/react-dom/cjs/react-dom.development.js', import.meta.url);

  const [reactModule, reactDomModule] = await Promise.all([
    import(/* @vite-ignore */ reactUrl.href),
    import(/* @vite-ignore */ reactDomUrl.href),
  ]);

  const resolvedReact =
    (reactModule as { default?: typeof React }).default ?? ((reactModule as unknown) as typeof React);
  const resolvedDom =
    (reactDomModule as { default?: typeof ReactDOM }).default ??
    ((reactDomModule as unknown) as typeof ReactDOM);

  return {
    react: resolvedReact,
    reactDom: attachClientExports(resolvedDom),
  };
}

async function ensureGlobals(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  const domWithClient = attachClientExports(ReactDOM);
  if ((domWithClient as Record<string, unknown>)[INTERNALS_KEY]) {
    window.React = React;
    window.ReactDOM = domWithClient;
    return;
  }

  const { react, reactDom } = await loadDevReactBundles();
  window.React = react;
  window.ReactDOM = reactDom;
}

export function ensureWidgetReactGlobals(): Promise<void> {
  if (reactGlobalPromise) {
    return reactGlobalPromise;
  }
  reactGlobalPromise = ensureGlobals();
  return reactGlobalPromise;
}
