# Chatbot Widget Theming App Guide

This theming application now relies exclusively on the `@schmitech/chatbot-widget` package from npm. All logic for switching between local and npm builds has been removed, which keeps the development workflow simple and mirrors production.

## Quick Start

```bash
npm install
npm run dev
```

To produce an optimized build:

```bash
npm run build
```

If you prefer a scripted setup that also writes `.env.local`, run `./deploy.sh`. The script configures the environment for npm usage and then launches `npm run dev`.

## Environment Variables

Only the npm-specific variables remain. Create a `.env.local` file when you need to override defaults.

```bash
VITE_NPM_WIDGET_VERSION=0.7.1       # Force a specific widget version from npm
VITE_WIDGET_DEBUG=false             # true = verbose loader logs, false = quiet
VITE_PROMPT_ENABLED=true            # Hide or show the Prompt tab
VITE_DEFAULT_API_ENDPOINT=http://localhost:3000
VITE_GITHUB_OWNER=schmitech
VITE_GITHUB_REPO=orbit
VITE_UNAVAILABLE_MSG=false          # true shows a site-wide maintenance banner
VITE_ENDPOINT_FIELD_ENABLED=true    # Allow editing the API endpoint input
VITE_API_CONFIG_ENABLED=true        # Hide API key/endpoint controls when false
```

### Sample `.env.local`

```bash
VITE_NPM_WIDGET_VERSION=0.7.1
VITE_WIDGET_DEBUG=true
VITE_PROMPT_ENABLED=false
VITE_DEFAULT_API_ENDPOINT=https://api.my-company.com
VITE_GITHUB_OWNER=my-org
VITE_GITHUB_REPO=my-chatbot
VITE_UNAVAILABLE_MSG=false
VITE_ENDPOINT_FIELD_ENABLED=true
VITE_API_CONFIG_ENABLED=true
```

## Debug Logging

`VITE_WIDGET_DEBUG` controls loader verbosity:

1. Production builds disable debug logs automatically.
2. Development builds enable debug logs unless you set `VITE_WIDGET_DEBUG=false`.
3. Setting `VITE_WIDGET_DEBUG=true` forces logging even in production (use sparingly).

Example output while debugging:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 INITIALIZING WIDGET WITH 📦 NPM PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Widget Configuration:
   Header: "AI Assistant"
   Welcome: "How can I help?"
   Suggested Questions: 2 items
   Primary Color: #EC994B
   Secondary Color: #1E3A8A
💡 Using NPM package v0.7.1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Widget initialized successfully with 📦 NPM PACKAGE!
```

Set `VITE_WIDGET_DEBUG=false` when you want a quiet console during development.

## Feature Toggles

- **Prompt tab** – `VITE_PROMPT_ENABLED=false` hides the Prompt UI and automatically routes users back to the Theme tab.
- **API configuration inputs** – `VITE_API_CONFIG_ENABLED=false` hides the API key/endpoint block entirely. Combine with `VITE_ENDPOINT_FIELD_ENABLED=false` if you want the endpoint locked to the runtime value.
- **GitHub stats** – Configure `VITE_GITHUB_OWNER` and `VITE_GITHUB_REPO` to point the GitHub badge and stats to a different repository.
- **Maintenance banner** – Set `VITE_UNAVAILABLE_MSG=true` to show a red warning banner across the top of the app.

## Deployment Workflow

1. Ensure dependencies are installed: `npm install`.
2. (Optional) Run `./deploy.sh` to regenerate `.env.local` with npm defaults.
3. Start the dev server with `npm run dev`.
4. Build for production with `npm run build` and serve the contents of `dist/`.

Because the widget is always loaded from npm/unpkg, no local file copying or custom scripts are necessary.

## Troubleshooting

- **Widget assets fail to load** – Confirm that `@schmitech/chatbot-widget` is installed and that your network allows requests to `https://unpkg.com`. You can also bump `VITE_NPM_WIDGET_VERSION` to a specific published version.
- **Missing `window.React` / `window.ReactDOM`** – The app now pins those globals from React 19 automatically in `src/main.tsx`, so a missing global typically indicates a script error earlier in the bundle.
- **Quiet console but widget not visible** – Temporarily set `VITE_WIDGET_DEBUG=true` to surface loader diagnostics, then reload the page to view dependency status logs.
- **API inputs hidden** – Check `VITE_API_CONFIG_ENABLED` and `VITE_ENDPOINT_FIELD_ENABLED`; these flags control the presence of the form fields.

For automated environments (CI, preview deployments, etc.), reuse the same `npm run dev`/`npm run build` commands—the widget source no longer affects the workflow.
