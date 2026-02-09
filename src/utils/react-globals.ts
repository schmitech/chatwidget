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
 *
 * The chatbot widget UMD bundles a **development** build of react-dom whose
 * reconciler accesses dev-only fields on ReactSharedInternals (actQueue,
 * asyncTransitions, thrownErrors, etc.). The production React build omits
 * these fields, so we patch them onto the shared internals object to prevent
 * "Cannot read properties of undefined (reading 'push')" crashes.
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

  // The widget's bundled dev react-dom reads these fields from React's shared
  // internals. Production React only ships { H, A, T, S }, so we add the
  // missing dev-only fields with their default values. This is safe because
  // production React never accesses these fields.
  const internals = (React as Record<string, unknown>)
    .__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE as
    | Record<string, unknown>
    | undefined;

  if (internals) {
    internals.actQueue ??= null;
    internals.asyncTransitions ??= 0;
    internals.didUsePromise ??= false;
    internals.thrownErrors ??= [];
    internals.getCurrentStack ??= null;
    internals.recentlyCreatedOwnerStacks ??= 0;
  }

  return Promise.resolve();
}
