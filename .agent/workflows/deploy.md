---
description: How to deploy the MySupermarket site
---

# Deployment Workflow

This site follows the **NextReset Model** with strict separation between build (shell) and refresh (data).

## Prerequisites
- Node.js and npm installed
- Repository cloned locally

## Deployment Steps

### 1. Refresh Data (Optional - if updating sources)
```bash
npm run refresh:data
```
This:
- Fetches latest data from providers (ONS, FSA, etc.)
- Writes JSON to `public/data/`
- Generates `_registry.json` and `_meta.json`
- Does **NOT** generate HTML

### 2. Build Site
// turbo
```bash
npm run build
```
This:
- Bundles client-side JS (`src/client/app.ts` → `public/assets/app.js`)
- Copies `public/` → `dist/` (including `public/data/`)
- Produces deployable artifact in `dist/`

### 3. Deploy to Cloudflare Pages
The site is configured for Cloudflare Pages:
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Environment**: Node 18+

**Important**: The `public/_redirects` file ensures SPA routing works correctly.

## Local Development
// turbo
```bash
npm start
```
Serves `dist/` on `http://localhost:3000`

**Note**: Stop the server (Ctrl+C) before running `npm run build` to avoid file locking issues on Windows.

## Build vs Refresh Contract
- **Build**: Shell only (`dist/index.html`, `dist/assets/`, copies `public/data/` → `dist/data/`)
- **Refresh**: Data only (`public/data/*.json`)
- **Deploy**: Always deploys `dist/` which contains both shell and data
