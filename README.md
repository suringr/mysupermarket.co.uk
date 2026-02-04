# MySupermarket Signals

**MySupermarket** is a static reference site for UK supermarket trends, focusing on price pressure, food inflation, and safety alerts.

It is built as a lightweight **Single Page Application (SPA)** using a "Static Shell + Data" architecture.

## Architecture

- **App Shell**: A static `index.html` + `app.js` (bundled via esbuild) that handles routing and rendering.
- **Data**: Pure JSON files generated in `public/data/` by the refresh pipeline.
- **Routing**: Client-side routing using the History API. Cloudflare Pages serves `index.html` for all routes.

## Scripts

| Command | Description |
| :--- | :--- |
| `npm run refresh:data` | Fetches fresh data from providers and writes JSON to `public/data/`. Generates `_registry.json`. |
| `npm run build:client` | Bundles `src/client/app.ts` into `public/assets/app.js` using esbuild. |
| `npm run build` | Full build: Compiles client and exports `public/` to `dist/`. |
| `npm run build:all` | Runs `refresh:data` then `build`. Ideal for CI/CD. |
| `npm start` | Serves the `dist` folder locally using `serve`. |

## Project Structure

```
├── public/
│   ├── assets/          # Compiled JS and styles
│   ├── data/            # Generated JSON data (ignored in git except _meta)
│   ├── index.html       # App Shell
│   └── _redirects       # Cloudflare routing rules
├── scripts/
│   ├── providers/       # Data fetchers (Inflation, Alerts, etc.)
│   ├── refresh-data.ts  # Main data orchestration
│   └── export-site.ts   # Copy public -> dist
├── src/
│   └── client/          # Client-side TypeScript app
│       ├── app.ts       # Router & Entry Point
│       ├── data.ts      # Data fetching with cache busting
│       ├── layout.ts    # Shared UI components
│       └── renderers/   # Page-specific render logic
└── dist/                # Deployment artifact (generated)
```

## Deployment

Deploy the `dist/` folder to any static host (Cloudflare Pages, Vercel, Netlify).

**Cloudflare Pages Configuration:**
- **Build command**: `npm run build:all` (or `npm run build` if data is external)
- **Output directory**: `dist`
- **Node.js**: Ensure v18+

## Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run data refresh** (required for first run):
   ```bash
   npm run refresh:data
   ```

3. **Build & Serve**:
   ```bash
   npm run build
   npm start
   ```

## License

MIT