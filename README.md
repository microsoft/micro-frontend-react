# Micro-Frontend React

An open source library providing utilities to support micro-frontend architecture in React.js applications.

## Packages

| Package | Description |
|---------|-------------|
| `@micro-frontend-react/core` | ComponentProvider, WebpackConfigs, Context |
| `@micro-frontend-react/redux` | StoreBuilder, ReducerRegistry, Redux integration |
| `@micro-frontend-react/employee-experience` | AuthClient, Shell, telemetry, routing (Microsoft EE extension) |

## Prerequisites

- Node.js 18+
- npm 9+

## Getting Started

```bash
# Install dependencies (uses npm workspaces)
npm install

# Build all packages
npm run build

# Serve the basic sample (host on :9000, micro-frontend on :8000)
npm run serve

# Serve the Redux sample
npm run serve:redux
```

### Employee Experience Sample

The EE sample uses internal Microsoft package registries. It is not part of npm workspaces.

```bash
# Install dependencies (uses .npmrc for internal registries) and link local packages
npm run install:ee

# Serve the EE example
npm run serve:ee
```

## How It Works

Host applications load micro-frontends at runtime using `ComponentProvider`:

```tsx
<ComponentProvider
  config={{
    script: 'http://localhost:8000/bundles/micro-frontend-app.js',
    name: 'MicroFrontendApp',
  }}
/>
```

Micro-frontends are webpack UMD bundles that register on `window.__MICRO_FRONTENDS__`. Shared dependencies (React, react-router-dom, styled-components) are loaded once from CDN as webpack externals, ensuring a single instance across all micro-frontends.

## Samples

### React.js
* [Host application](samples/sample-react-host/src/App.tsx) — provides shared Context and loads micro-frontends via `ComponentProvider`
* [Micro-Frontend application](samples/sample-react-micro-frontend/src/MicroFrontendApp.tsx) — developed and deployed in isolation, receives Context when mounted

### React.js with Redux
* [Host application with Redux](samples/sample-react-redux-host/src/App.tsx) — host with redux-sagas, redux-logger, redux-persist
* [Micro-Frontend with Redux](samples/sample-react-redux-micro-frontend/src/MicroFrontendApp.tsx) — reads from host Redux store, registers reducers and sagas dynamically

## Version Constraints & Roadmap

### Current Limitations (v1.x)

The micro-frontend architecture relies on UMD bundles loaded from CDN as webpack externals. This constrains several dependencies to their last UMD-available versions:

| Package | Pinned Version | Reason |
|---------|---------------|--------|
| `react` / `react-dom` / `react-is` | 18.3.1 | React 19 removed official UMD builds |
| `react-router-dom` | 5.3.4 | v6+ removed UMD builds; v5 API (`Switch`, `exact`, `render` prop, `withRouter`) |
| `styled-components` | 5.3.11 | v6 removed UMD builds |

React 18 is in security-only support (active support ended Dec 2024). react-router-dom v5 and styled-components v5 are no longer actively maintained.

These libraries cannot be upgraded without replacing the UMD/CDN external loading pattern.

### Planned v2.0 — Module Federation

v2.0 will migrate from UMD script injection to **webpack Module Federation**, which:
- Removes the UMD/CDN dependency, unblocking React 19+, react-router-dom v7+, styled-components v6+
- Shares dependencies at runtime via webpack's container API (`singleton: true`) instead of global variables
- Supports dynamic remotes — micro-frontend URLs resolved at runtime from backend APIs (no build-time configuration required)
- Replaces `window.__MICRO_FRONTENDS__` global registry with federated module imports
- Requires a rewrite of `ComponentProvider`'s script loading mechanism

**v2.0 is a breaking change** for consumers. The `IComponentConfig` interface will change from `{ script, name }` to a federated remote format, and consumers will need to add `ModuleFederationPlugin` to their webpack configs with shared dependency declarations.

## Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install all workspace dependencies |
| `npm run build` | Build all library packages via lage |
| `npm run serve` | Serve basic sample apps |
| `npm run serve:redux` | Serve Redux sample apps |
| `npm run install:ee` | Install EE generator example + link local packages |
| `npm run serve:ee` | Serve EE generator example |
| `npm run clean` | Clean build artifacts |
| `npm run nuke` | Full reset (delete node_modules, reinstall, clean) |
| `npm version patch --workspaces --no-git-tag-version` | Bump all package versions |

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
