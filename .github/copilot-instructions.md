# Copilot Instructions — micro-frontend-react

## Project Overview
Monorepo for the `@micro-frontend-react` npm packages enabling micro-frontend architecture on React applications. Host apps load micro-frontends at runtime via script injection and a global `window.__MICRO_FRONTENDS__` registry.

## Repository Structure
```
packages/micro-frontend-react/          → @micro-frontend-react/core (ComponentProvider, WebpackConfigs, Context)
packages/micro-frontend-react-redux/    → @micro-frontend-react/redux (StoreBuilder, ReducerRegistry)
packages/microsoft-employee-experience/ → @micro-frontend-react/employee-experience (AuthClient, Shell, telemetry, routing)
samples/sample-react-host/              → Sample host app (core only)
samples/sample-react-micro-frontend/    → Sample micro-frontend (core only)
samples/sample-react-redux-host/        → Sample host app (with Redux)
samples/sample-react-redux-micro-frontend/ → Sample micro-frontend (with Redux)
samples/sample-employee-experience/         → EE sample app (standalone, internal registry)
```

## Build System
- **npm workspaces** for dependency management (`packages/*` and `samples/sample-react-*`; no lerna, no yarn)
- **lage** for task orchestration (`npm run build` runs `lage build --no-cache`)
- **TypeScript** compiled via `tsc` (not webpack) for library packages
- **webpack 5** for sample apps and the generator example
- Build order enforced by lage pipeline: core → redux → employee-experience

## Key Commands
```
npm install                 # Install all workspace dependencies
npm run build               # Build all library packages (lage)
npm run serve               # Serve sample-react-host + sample-react-micro-frontend
npm run serve:redux         # Serve sample-react-redux-host + sample-react-redux-micro-frontend
npm run install:ee          # Install generator example deps (uses internal .npmrc) + link local packages
npm run serve:ee            # Serve the EE generator example
npm run clean               # Clean all build artifacts
npm run nuke                # Full reset: delete node_modules + reinstall + clean
npm version patch --workspaces --no-git-tag-version  # Bump all package versions
```

## Architecture Constraints

### UMD Externals Pattern
React, react-router-dom, and styled-components are loaded as **UMD bundles from CDN** (`ee.azureedge.net`) and declared as webpack externals. This is fundamental to the micro-frontend architecture — host and micro-frontends share a single React instance via globals (`window.React`, `window.ReactDOM`, `window.ReactRouterDOM`, `window.styled`).

**Do not upgrade these beyond their UMD-available versions:**
- `react` / `react-dom` / `react-is`: **18.3.1** (last version with official UMD builds; React 19 dropped UMD)
- `react-router-dom`: **5.3.4** (v6+ dropped UMD; v5 API: `Switch`, `exact`, `render` prop, `withRouter`)
- `styled-components`: **5.3.11** (v6 dropped UMD)

### Peer Dependencies
Library packages declare peer deps with `>=` lower bounds (no upper bounds). When modifying peer deps, ensure the range covers what consumers actually use.

### Employee Experience Sample (EE)
The `samples/sample-employee-experience/` project is **not** in npm workspaces because it depends on internal Microsoft packages (`@coherence-design-system`, `@m365-admin`) from private registries configured in its `.npmrc`. It links to the local `employee-experience` build via `npm link` (handled by `npm run install:ee`).

## TypeScript Configuration
- Library packages use `moduleResolution: "bundler"` (required for `@redux-devtools/extension` v4)
- No `typeRoots` — TypeScript's default resolution handles hoisted `@types` correctly in workspaces and for published consumers
- `skipLibCheck: true` is set on all packages
- `strict: true` on all packages

## Code Patterns

### ComponentProvider
Core mechanism for loading micro-frontends. Injects a `<script>` tag, waits for the UMD bundle to register on `window.__MICRO_FRONTENDS__[fileName][componentName]`, then renders the component. Do not change the loading mechanism without a major version bump.

### AuthClient (employee-experience)
Uses `@azure/msal-browser` v5. The `PublicClientApplication` must be initialized async (`await instance.initialize()`) before calling any API methods including `handleRedirectPromise()`.

### StoreBuilder (redux)
Uses `redux-persist` with a `PersistConfig<T>` generic. The dynamic reducer persist config requires an `as any` cast due to type incompatibility between the generic and `combineReducers` return type.

## Version Constraints

### Pinned Dependencies (UMD requirement)
The micro-frontend architecture loads shared dependencies as UMD bundles from CDN (`ee.azureedge.net`). These packages are pinned to their last UMD-available versions:

| Package | Max Version | Why |
|---------|------------|-----|
| `react` / `react-dom` / `react-is` | 18.3.1 | React 19 removed official UMD builds |
| `react-router-dom` | 5.3.4 | v6+ removed UMD; uses v5 API (`Switch`, `exact`, `render` prop, `withRouter`) |
| `styled-components` | 5.3.11 | v6 removed UMD builds |

React 18 active support ended Dec 2024 (security-only). react-router-dom v5 and styled-components v5 are no longer actively maintained. Do not upgrade these without migrating away from the UMD external pattern.

### Planned v2.0 — Module Federation
v2.0 will replace UMD script injection with **webpack Module Federation**:
- Unblocks React 19+, react-router-dom v7+, styled-components v6+
- Shares deps via webpack container API (`singleton: true`) instead of CDN globals
- Supports dynamic remotes (micro-frontend URLs from backend APIs at runtime)
- Replaces `window.__MICRO_FRONTENDS__` with federated module imports
- `ComponentProvider` loading mechanism will be rewritten
- `IComponentConfig` will change from `{ script, name }` to a federated remote format
- **Breaking change** for all consumers

## When Making Changes
1. Always run `npm run build` after changes — lage handles build ordering
2. After modifying package versions, update all internal cross-references (grep for `@micro-frontend-react/` in package.json files)
3. Test samples with `npm run serve` and `npm run serve:redux` to verify runtime behavior
4. The webpack `generateDevServerSettings` uses `server: 'https' | 'http'` (webpack-dev-server v5 API), not the deprecated `https: boolean`
5. Do not add `react-router-dom` v6/v7 APIs (`Routes`, `element` prop, `useNavigate`) — the project uses v5 APIs throughout
