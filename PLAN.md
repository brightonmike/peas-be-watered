
## 1. Overview

A UK-focused PWA for allotment holders that answers one question:

> Is it worth making the trip to water my crops?

The goal is to eliminate pointless journeys and wasted water — good for the user, good for the environment. The app gives a single, confident recommendation. No accounts. No backend. No complexity.

---

## 2. MVP Scope

### In Scope
- Postcode input
- Crop selection (autocomplete)
- Weather-based watering recommendation
- Local storage (no backend)
- PWA installable

### Out of Scope
- User accounts
- Database / backend
- Notifications
- Analytics
- Charts / dashboards
- Social features

---

## 3. User Flow

### Step 1 — Setup
- Enter postcode
- Add crops via autocomplete

Example:
- Tomatoes
- Courgettes
- Runner beans

---

### Step 2 — Daily Use
User opens app → sees single recommendation:

- ✅ No watering needed
- 💧 Light watering
- 🚿 Deep watering needed
- ⚠️ Heat stress warning

Plus 1-line explanation:

> “Heavy rain expected in 2 days.”

---

## 4. Data Model

User data stored in a **cookie** (small, server-readable — enables RSC weather fetching without exposing the API key to the client):

```json
{
  "postcode": "SW16",
  "crops": ["tomato", "courgette"]
}
```

---

## 5. Crop Model

Simple static config:

```json
{
  "tomato":             { "waterNeed": 9, "droughtTolerance": 2 },
  "courgette":          { "waterNeed": 8, "droughtTolerance": 3 },
  "cucumber":           { "waterNeed": 9, "droughtTolerance": 2 },
  "celery":             { "waterNeed": 9, "droughtTolerance": 1 },
  "lettuce":            { "waterNeed": 8, "droughtTolerance": 2 },
  "spinach":            { "waterNeed": 7, "droughtTolerance": 3 },
  "chard":              { "waterNeed": 7, "droughtTolerance": 3 },
  "peas":               { "waterNeed": 7, "droughtTolerance": 3 },
  "runner-beans":       { "waterNeed": 7, "droughtTolerance": 3 },
  "french-beans":       { "waterNeed": 7, "droughtTolerance": 3 },
  "broad-beans":        { "waterNeed": 5, "droughtTolerance": 5 },
  "sweetcorn":          { "waterNeed": 7, "droughtTolerance": 4 },
  "pepper":             { "waterNeed": 7, "droughtTolerance": 3 },
  "aubergine":          { "waterNeed": 7, "droughtTolerance": 3 },
  "pumpkin":            { "waterNeed": 8, "droughtTolerance": 3 },
  "butternut-squash":   { "waterNeed": 7, "droughtTolerance": 4 },
  "cabbage":            { "waterNeed": 6, "droughtTolerance": 4 },
  "broccoli":           { "waterNeed": 6, "droughtTolerance": 4 },
  "cauliflower":        { "waterNeed": 6, "droughtTolerance": 3 },
  "kale":               { "waterNeed": 5, "droughtTolerance": 5 },
  "brussels-sprouts":   { "waterNeed": 6, "droughtTolerance": 4 },
  "beetroot":           { "waterNeed": 6, "droughtTolerance": 4 },
  "carrot":             { "waterNeed": 5, "droughtTolerance": 5 },
  "parsnip":            { "waterNeed": 4, "droughtTolerance": 6 },
  "potato":             { "waterNeed": 7, "droughtTolerance": 4 },
  "sweet-potato":       { "waterNeed": 6, "droughtTolerance": 5 },
  "onion":              { "waterNeed": 4, "droughtTolerance": 6 },
  "shallot":            { "waterNeed": 4, "droughtTolerance": 6 },
  "leek":               { "waterNeed": 5, "droughtTolerance": 5 },
  "garlic":             { "waterNeed": 3, "droughtTolerance": 7 },
  "radish":             { "waterNeed": 5, "droughtTolerance": 4 },
  "turnip":             { "waterNeed": 5, "droughtTolerance": 4 },
  "swede":              { "waterNeed": 5, "droughtTolerance": 4 },
  "fennel":             { "waterNeed": 6, "droughtTolerance": 4 },
  "celeriac":           { "waterNeed": 8, "droughtTolerance": 2 },
  "globe-artichoke":    { "waterNeed": 5, "droughtTolerance": 5 },
  "jerusalem-artichoke":{ "waterNeed": 3, "droughtTolerance": 8 },
  "asparagus":          { "waterNeed": 4, "droughtTolerance": 6 },
  "rhubarb":            { "waterNeed": 5, "droughtTolerance": 5 },
  "strawberry":         { "waterNeed": 7, "droughtTolerance": 3 },
  "raspberry":          { "waterNeed": 6, "droughtTolerance": 4 },
  "blackcurrant":       { "waterNeed": 6, "droughtTolerance": 4 },
  "redcurrant":         { "waterNeed": 5, "droughtTolerance": 5 },
  "gooseberry":         { "waterNeed": 5, "droughtTolerance": 5 },
  "mint":               { "waterNeed": 7, "droughtTolerance": 3 },
  "basil":              { "waterNeed": 7, "droughtTolerance": 2 },
  "parsley":            { "waterNeed": 6, "droughtTolerance": 3 },
  "chives":             { "waterNeed": 5, "droughtTolerance": 5 },
  "coriander":          { "waterNeed": 6, "droughtTolerance": 3 },
  "dill":               { "waterNeed": 5, "droughtTolerance": 4 },
  "thyme":              { "waterNeed": 3, "droughtTolerance": 8 },
  "rosemary":           { "waterNeed": 2, "droughtTolerance": 9 },
  "sage":               { "waterNeed": 3, "droughtTolerance": 8 },
  "oregano":            { "waterNeed": 3, "droughtTolerance": 8 }
}
```

Scores on a scale of 1–10. `waterNeed` = how much water the crop requires at peak. `droughtTolerance` = how long it can go without water before stress. Both values are placeholders — to be reviewed/adjusted.

---

## 6. Weather Data

**API requirements:**
- Rain forecast (next 3–5 days)
- Temperature
- Wind speed
- Humidity

**Optional:**
- Historical rainfall (nice-to-have)

**Providers:**
- OpenWeather (preferred)
- Met Office API (fallback option)

**Fetching:**
- Weather fetched in an RSC — API key stays in server env vars, never exposed to client
- No separate proxy function needed; Next.js handles it natively

**Caching:**
- `fetch` with `{ next: { revalidate: 10800 } }` (3-hour cache, keyed per postcode)
- Next.js deduplicates and caches automatically

---

## 7. Decision Engine

**Goal:** Produce a single confident recommendation: is it worth the journey to water today?

**Soil moisture score** — a single number 0–100 representing estimated soil wetness:

```
moisture = baseline
  + recentRainScore
  + forecastRainScore
  - evaporationLoss
  - dailyDrain
```

**Daily drain** (per crop, per day without significant rain):
```
dailyDrain = waterNeed × 0.5
```

**Watering threshold** (moisture level below which crop is stressed):
```
threshold = (10 - droughtTolerance) × 5
```

**Multiple crops — use the most demanding**
When a user has multiple crops, drive the recommendation from the crop with the highest threshold relative to current moisture. If the thirstiest crop needs water, the user should make the trip. Per-crop detail is out of scope for MVP.

**Output states**

| Condition | State |
|---|---|
| moisture > threshold + 20 | ✅ No watering needed |
| moisture > threshold | 💧 Light watering |
| moisture ≤ threshold | 🚿 Deep watering needed |
| moisture ≤ threshold AND temp > 25°C | ⚠️ Heat stress warning |

**Rain weighting**

| Rainfall | Score |
|----------|-------|
| 0–1mm | negligible |
| 2–5mm | +10 |
| 5–15mm | +25 |
| 15mm+ | +50 |

**Evaporation factors**
- High temperature ↑ evaporation
- Wind ↑ evaporation
- Low humidity ↑ evaporation

> The constants (×0.5, ×5, score increments) are starting-point estimates to be tuned empirically over time.

---

## 8. Forecast Awareness Rule (Critical)

DO NOT recommend watering if:

Significant rain is expected within ~48 hours

Example:

> Today dry  
> Tomorrow 18mm rain  
> → Output: No watering

---

## 9. Output States

- ✅ No watering needed
- 💧 Light watering
- 🚿 Deep watering needed
- ⚠️ Heat stress warning

---

## 10. Recommendation Format

Always return:

1. Decision
2. One-line reason

Example:

> 💧 Water tomorrow  
> Warm, dry conditions and no meaningful rain expected.

---

## 11. UI Requirements

**Home Screen**
- Single recommendation card (primary focus)

**Crop Input**
- Autocomplete select
- Selected crops shown as removable chips

Example:

> Tomatoes ×  
> Courgettes ×

**UX Principles**
- One screen = one answer
- No graphs
- No dashboards
- No complexity exposed

---

## 12. Tech Stack

**Frontend**
- Next.js
- TypeScript
- Tailwind CSS

**Storage**
- Cookie (postcode + crops — server-readable, enables RSC fetching)

**Rendering**
- RSC fetches weather server-side; API key never reaches the client
- Static shell renders instantly; recommendation streams in via Suspense
- 3-hour cache per postcode via Next.js fetch revalidation

**PWA**
- Installable
- Offline shell (static shell only — live weather requires a connection)

**Hosting**
- Netlify (Next.js app, no separate serverless functions needed)

---

## 13. Architecture

```
UI
 ↓
Crop Store (IndexedDB)
 ↓
Decision Engine
 ↓
Weather API (cached)
 ↓
Recommendation Output
```

---

## 14. Success Criteria

MVP is successful if:

- Users check it daily
- Users trust recommendation
- It reduces watering uncertainty
- It feels faster than checking weather apps

---

## 15. Explicit Non-Goals

This is NOT:

- a farm management system
- a social gardening app
- a sensor platform
- an AI agronomy system
- a data-heavy dashboard product

---

## 16. Future Enhancements (Later)

- Per-crop watering detail (needs UX exploration before building — risk of confusing users)
- Push notifications
- Soil type modelling
- Moisture history
- Multiple allotments
- Disease risk warnings
- Account sync