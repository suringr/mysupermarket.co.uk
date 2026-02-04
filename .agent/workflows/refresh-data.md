---
description: How to refresh data from providers
---

# Data Refresh Workflow

## Overview
The data refresh process fetches the latest information from official sources and writes it to `public/data/` as JSON files.

## Run Data Refresh
// turbo
```bash
npm run refresh:data
```

## What It Does
1. Runs all data providers in `scripts/providers/`:
   - `uk.food-alerts.ts` - FSA food safety alerts
   - `uk.food-inflation.ts` - ONS inflation metrics
   - `uk.eggs.pressure.ts` - Egg price tracking
   - `uk.inflation.notices.ts` - Government notices

2. For each provider:
   - Fetches data via HTTP or browser (fallback)
   - Implements retry logic (3 attempts)
   - Uses last-good fallback on failure
   - Writes JSON to `public/data/{provider-id}.json`

3. Generates metadata:
   - `public/data/_registry.json` - List of all providers
   - `public/data/_meta.json` - Last refresh timestamp

## Output Structure
```
public/data/
├── _registry.json          # Index of all signals
├── _meta.json              # Refresh metadata
├── uk.food-alerts.json     # Food safety alerts
├── uk.food-inflation.json  # Inflation metrics
├── uk.eggs.pressure.json   # Price pressure data
└── uk.inflation.notices.json # Government notices
```

## Important Notes
- ✅ Refresh writes **ONLY JSON** (no HTML generation)
- ✅ Data is automatically copied to `dist/data/` during build
- ✅ Failed providers fall back to cached data (fail-safe)
- ⚠️ Does not trigger a rebuild (run `npm run build` separately)
