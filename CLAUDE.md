@AGENTS.md

# Croppy

A UK-focused PWA for allotment holders. Answers one question: **is it worth making the trip to water my crops today?**

The goal is to eliminate pointless journeys and wasted water. One screen, one confident recommendation, no complexity exposed to the user.

## Stack

- **Next.js 16** — App Router, `src/` directory, TypeScript
- **Tailwind CSS 4**
- **pnpm** — always use pnpm, not npm or yarn
- **Netlify** — hosting; no serverless functions (Next.js RSCs handle everything)
- Node via nvm — run `nvm use 20` if `node` resolves to an old version

## Architecture

Weather data is fetched inside **React Server Components**. The API key lives in server env vars and never reaches the client. No proxy function needed.

User data (postcode + crops) is stored in a **cookie** — small, server-readable, enables RSC fetching without any client-side plumbing.

Rendering strategy:
- Static shell renders instantly
- Recommendation card streams in via a Suspense boundary
- Weather fetch cached with `{ next: { revalidate: 10800 } }` (3 hours, keyed per postcode)

## Key decisions

- **UK only** — postcodes, UK weather API
- **Most demanding crop drives the recommendation** — if one crop needs water, the user should make the trip. Per-crop detail is a future enhancement requiring UX exploration first.
- **Four output states:** ✅ No watering needed / 💧 Light watering / 🚿 Deep watering needed / ⚠️ Heat stress warning
- **Forecast awareness is critical** — never recommend watering if >10mm rain is forecast within 48 hours

## Decision engine

Soil moisture score (0–100):
```
moisture = baseline + recentRainScore + forecastRainScore - evaporationLoss - dailyDrain
dailyDrain = waterNeed × 0.5
threshold  = (10 - droughtTolerance) × 5
```

Output is determined by comparing moisture against the most demanding crop's threshold. Constants are provisional — tune empirically through use.

## Crop data

54 crops defined as static config with `waterNeed` (1–10) and `droughtTolerance` (1–10). See `PLAN.md` for the full list. Values are starting-point estimates.

## What this is NOT

- Not a farm management system
- Not a per-crop dashboard
- Not a social or account-based app
- Not a sensor platform

## Full plan

See `PLAN.md` for complete scope, data model, UI requirements, and future enhancements.
