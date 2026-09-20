# UI kit — NutriLife mobile app

Click-through recreation of the **heart flow** specified in `uploads/dizayn-tz.md`:
open the app → see the daily ring → add food → the ring fills.

| Screen | File | Spec id |
|---|---|---|
| Home (daily ring) | `screens-home.jsx` → `HomeScreen` | E1 |
| Source picker (bottom sheet) | `app.jsx` (sheet inside `NutriLifeApp`) | E2 |
| Camera + review | `screens-ai.jsx` → `CameraScreen` | E3 |
| Food search | `screens-manual.jsx` → `SearchScreen` | E4 |
| Food detail / portion | `screens-manual.jsx` → `FoodScreen` | E5 |
| AI analysis | `screens-ai.jsx` → `AnalyzingScreen` | E6 |
| AI result / confirm | `screens-ai.jsx` → `ResultScreen` | E7 |
| Added (ring animates) | `screens-ai.jsx` → `AddedScreen` | E8 |
| Journal | `screens-home.jsx` → `JournalScreen` | E9 |
| Entry editor | `screens-home.jsx` → `EditScreen` | E10 |

`phone.jsx` is the 390×844 device shell plus the `Scroll` and `Section` helpers.
`data.jsx` holds the fake Uzbek dish database, the daily goals and the number formatter.

**The side panel in `index.html` is scaffolding, not product UI** — it flips the loading,
error, empty, offline, scan-limit and "AI could not recognise" states and jumps to any
screen by its spec id.

## Known gaps
- No food photography was supplied, so every `FoodImage` renders its `--chegara`
  placeholder box. That is the specified pre-load state, not a bug.
- Recipes, Progress and Profile tabs are navigable in the bottom bar but out of scope
  in the source spec (`dizayn-tz.md` §2) — tapping them does not change the screen.
- Copy is Uzbek only. The spec requires uz / ru / en; ru strings run ~20% longer.

## Retseptlar tab (R1, R2)

`ui_kits/shared/recipes.js` is a **required prerequisite script**: load it before
`data.jsx` (both kit pages do). It is a plain file with no `.d.ts`, so it is deliberately
not compiled into `_ds_bundle.js`; the kits resolve it defensively and fall back to an
empty list, which renders the "Hozircha retsept yo'q" empty state rather than throwing.

The recipes surface reads the **shared recipe store**, `ui_kits/shared/recipes.js` — the
same file the admin panel's A9 editor writes to. Nothing about recipes is hardcoded in
this kit: the list, the counts, the categories chips and every field on the detail screen
are derived from that store.

| Screen | File | Shows |
|---|---|---|
| R1 recipe grid | `screens-recipes.jsx` → `RecipesScreen` | Two-column grid of published recipes; each card is image, then calories on their own line, then name, then difficulty. Category chips are built from the data. No preparation time on cards. |
| R2 recipe detail | `screens-recipes.jsx` → `RecipeScreen` | PRO only. Sharp image, per-portion calories with macro bars, full ingredient list, numbered preparation steps |
| R3 recipe paywall | `screens-recipes.jsx` → `RecipePaywallScreen` | What a FREE user gets instead of R2: blurred image with a lock, what the recipe contains (kcal, ingredient count, step count), and the subscribe CTA |

### Rules it enforces

- **Only `holat === 'Chop etilgan'` reaches the app.** The draft recipe in the store
  (`Bug'da pishirilgan baliq`) appears in the admin list and nowhere in the app.
- **No preparation section when the admin added no steps.** `Grechka bo'tqasi` is
  published with ingredients and an empty `qadamlar` array; R2 renders its ingredients and
  omits the "Tayyorlash" section entirely — no empty card, no placeholder.
- **Recipes are gated whole.** A FREE user sees the grid with **blurred images** (6px on
  cards, 10px on the paywall) and a PRO pill; tapping a recipe routes to R3, never R2.
  A PRO user sees sharp images and the full details. Toggle "PRO obuna" in the state panel.
- The paywall states what is behind it — calories, ingredient count and, when the admin
  entered them, the step count — rather than hiding that the recipe exists.
- Ingredients and steps are stored per language (`{uz, ru, en}`) because A9 edits each
  language under its own tab. The app renders `uz`; `RECIPE_LANG` at the top of
  `screens-recipes.jsx` is the single switch.

Progress and Profil tabs render `SoonScreen` — a stated absence, since no spec covers them.

## Statistika tab (P1–P3)

Built from `uploads/progress-tz.md`. Data in `data-progress.jsx`, screens in
`screens-progress.jsx`.

| Screen | Shows |
|---|---|
| P1 Statistika | Weight card (current weight largest, change since the start, goal, remaining difference, journey progress bar), the "＋ Vaznni qayd etish" primary CTA, `WeightChart` with the 30/90/all switch and dashed goal line, one-line streak row, "25 / 30 kun" tracked days with the 30-day `DayGrid`, goal-remaining row, weekly-change row, link to history |
| P2 Vazn qo'shish | Bottom sheet, today only, last weight pre-filled. One record per day — if today already exists the title becomes "Bugungi vaznni yangilash" |
| P3 Vazn tarixi | Full date and weight on one line (`15.09.2026 — 85,0 kg`), delta from the previous measurement beneath, edit and delete per row |

### Rules it enforces

- **Definitions are fixed** (§1): a tracked day has at least one *confirmed* entry; today
  without an entry does not break the streak.
- **No medical interpretation** — no BMI, no healthy-range band, no forecast line. `WeightChart`
  and `DayGrid` are built so those cannot be added by accident.
- **No streak pressure**: nothing warns that a streak is about to break.
- P2 validates 30–300 kg and asks for confirmation past a 5 kg jump — a typo catch that
  never blocks. Saving recomputes the daily target and shows the one-line
  "Kunlik normangiz yangilandi: 2,190 → 2,150".
- **The onboarding measurement cannot be deleted** (P3) — it is the chart's origin.
- One-point state: with a single measurement the chart is replaced by "Ikkinchi
  o'lchovdan keyin grafik chiziladi" plus the add button. Toggle "Vazn: bitta nuqta".
- **Derived, never hardcoded.** Weights are stored as ISO dates only; `weightPoints()`
  formats them, `maqsadFoizi()` computes the progress bar from start → goal → now, and
  `haftalikOzgarish()` computes the weekly average. The weekly section **requires two
  measurements at least 14 days apart** and is hidden otherwise rather than showing a
  noisy or invented figure; the progress bar is hidden when start and goal are equal.
- The section is titled **Statistika** (renamed from Progress), including its bottom-nav
  label. The route id stays `progress`.

## Profil tab (F1–F5)

Built from `uploads/profil-tz-ffb78d8a.md`. Screens in `screens-profile.jsx`.

| Screen | Shows |
|---|---|
| F1 Profil | Avatar, name, "Ilovada 24 kun", the role card (three variants), summary rows (goal, current weight, target weight, daily target), **the settings rows themselves** — language, theme, weight/height/energy units, notifications, personal data, delete account — then help and legal links |
| F3 Shaxsiy ma'lumot | The onboarding answers, editable, with onboarding's own validation |
| F4 Obuna | Status, tariff, dates, payment history, cancel |
| F5 Hisobni o'chirish | Two steps: what disappears, then typing "O'CHIRISH" |
| F6 Yordam | A direct chat with the admin. Messages go to `../shared/support.js`, keyed by user id, and the admin answers from the panel's «So'rovlar» section — the same thread on both sides. An admin reply written in the same browser appears here without a refresh |

### Rules it enforces

- **The three role cards** are switchable in the state panel: FREE ("3 tadan 2 ta skan
  qoldi"), PRO ("14-oktabrgacha faol"), expired. The expired card states in writing that
  journal, history and progress stay readable and only new scans and full recipe text close.
- **There is no separate settings screen.** Every setting is a row on F1, opened by a
  bottom sheet in place; the spec's F2 inventory is preserved, its standalone page is not.
- **Units are a display layer** — stated under the rows; the base is always kg, sm and kkal.
- **Changing a field that moves the daily target asks first**: "Kunlik normangiz 2,190 dan
  2,240 ga o'zgaradi. Saqlansinmi?", and past days are never recomputed.
- **Current weight is not editable on F3** — it is a history record, so F3 links to P2 instead.
- **Cancelling explains itself**: there is no recurring charge, so cancelling only stops
  the next reminder. The confirmation carries the spec's exact wording.
- **Admin-granted PRO** shows "Administrator tomonidan berilgan" and no payment rows —
  toggle "Obuna admin bergan".
- Per-row saving and per-row error ("Saqlanmadi. Qayta urinish") leave the other settings
  usable; offline makes settings read-only.

## Navigation transition

Switching sections plays one **opacity-only** fade — `nutrilife-nav`, 175ms
(`--nav-duration`) on `--ease-nav` `cubic-bezier(0.4,0,0.2,1)`. No slide, scale or zoom.

Two reasons it is opacity-only rather than a transform:

1. It should not draw attention. A 10px translate on a whole screen reads as a slide.
2. `animation-fill-mode: both` leaves the final `transform` on the element forever, and a
   transformed ancestor becomes the containing block for everything inside it — which made
   cards drift against the scroll position on Home, Jurnal and Statistika. With opacity
   there is no transform, so every screen (scroll surfaces included) can share one wrapper.

Individual cards and text are **not** animated on arrival anywhere in the kit. Content that
lives inside a scroll surface gets **no entrance animation at all** — no fade, no
translate, no scale, no stagger, no animation delay — so text, cards and images are stable
the moment they render and move only with their scroll container. `nutrilife-rise` and the
paywall's `pw-rise` stagger are retired. What stays is deliberate interaction feedback:
button and card press scales, the scan line, the chart line draw and its points, the
count-up, the streak and tracked-day bumps, and the bottom-sheet slide.

## Motion

The kit links `guidelines/keyframes.css` alongside `styles.css`; without it the animations
simply do not play and every screen still renders. Screen bodies are keyed on the route so
each navigation plays one fade, not one per child.

Two demo hooks live in the state panel because the real triggers are server events:
**"Streak +1 (animatsiya)"** increments the streak and fires the one-shot bump, and saving a
weight in P2 tweens the P1 figure and the progress bar together. The AI calorie count-up
runs on arrival at the result screen (E7), and the scan band runs for the duration of E6.

See readme.md → "Micro-interactions" for the full table of durations and treatments.

## Mavzu (theme)

`Profil → Mavzu` drives the whole app, not just the row it sits in:

- **Yorug'** / **Qorong'i** force light or dark.
- **Tizim** follows `prefers-color-scheme` and keeps following it — the `change` listener
  stays subscribed, so flipping the device theme with the app open updates it live. The row
  shows what it currently resolves to ("Tizim · qorong'i").
- The choice is persisted to `localStorage` under `nutrilife.settings`, so it survives a
  reload. No other key is written.

`Phone` receives `dark` and sets `data-theme` on the frame, so every screen, card, button,
icon, bottom sheet and toast inside inherits it from the tokens — nothing re-declares
colours. Use **"Qurilma: tungi rejim"** in the dev panel to simulate the device switching
while **Tizim** is selected.

The camera and AI-analysis screens (E3, E6) are **always dark** by design — they sit behind
a photo — and declare `data-theme="dark"` locally. That is deliberate, not the setting
failing to apply.

## PRO gating — all nine features

### One state, one gate, one entry point

`proStatus` is the **only** subscription value in the app: `'free' | 'pro' | 'expired'`.
The earlier `isPro` boolean is gone — it sat beside `role` and the two could disagree.
`app.role` remains as a read-only alias so profile code keeps working.

- **Gate:** `proOpen(id, app)` from `ui_kits/shared/pro.js`. Never test `proStatus` directly
  in a screen — the registry decides, including expired-subscription read access.
- **Entry point:** `app.openTariffs(featureId)` for every lock, badge and CTA. Passing the
  id means a subscriber is let *through* to the feature instead of being sold to.
- **Persistence:** status lives in `localStorage` under `nutrilife.pro`. The paywall is a
  separate page, so a completed purchase writes that key and the app reads it on mount and
  on window focus. Buying PRO and returning unlocks all nine with no further action.

### The nine features and where they live

| Feature | Screen | Implementation |
|---|---|---|
| Kuniga 20 tagacha AI skan | Add sheet, E2–E7 | Real counter. `scanLimit` is 3 free / 20 PRO; `app.analyze()` spends one and routes to the paywall when the allowance is gone. Manual entry is never limited. |
| Retseptlarni to'liq ko'rish | R1–R3 | Images blur and the card routes to R3 for non-PRO; R2 opens on PRO |
| Nutrition Score | E1 Home | `nutritionScore()` — scores macro **balance** plus staying under target |
| Qolgan kaloriyaga mos taom takliflari | E1 Home | `mealSuggestion()` picks the real food + standard portion closest to filling what is left |
| Oqsil, yog' va uglevodlarni kuzatish | E1, E9 | Macro bars and journal totals, summed from entries |
| Aqlli porsiya tavsiyalari | E5, E7 | `portionAdvice()` — the portion that fits the remaining calories, capped at the food's largest normal serving |
| Batafsil ovqatlanish statistikasi | P1 | `detailedStats()` over 7/30 days: averages, macro split, days on target, extremes |
| Sevimli retseptlar | R1, R2 | Real favourites, persisted to `nutrilife.favourites`, with a **Sevimli** filter chip |
| Haftalik ovqatlanish hisoboti | P1 | `weekReport()` — this week vs last, per-day bars, days on target |

### Nothing on screen is a hardcoded number

All of it computes in `data-nutrition.jsx`, and **every function returns `null` when the
data is too thin** so the screen states that rather than showing a fabricated value:

- Nutrition Score → `null` with no entries ("birinchi ovqatni qo'shsangiz chiqadi")
- `detailedStats` → `null` under two logged days
- `weekReport` → `null` under three logged days this week
- `mealSuggestion` / `portionAdvice` → `null` when nothing is left to spend

`HISTORY` is 30 days of seeded journal data — sample like `FOODS` and `WEIGHTS`, but its
nutrition values are **derived from the `FOODS` table**, so changing a food's calories
flows through every historical day, average and report. `TRACKED` and `STREAK` in
`data-progress.jsx` are now derived from `HISTORY` too: a day counts as tracked exactly
when it has entries, and the streak is counted from those flags. Today's live `entries`
override the seeded day, so the statistics read the same data the user edits.

### Expired keeps reading

Per profil-tz §F1, an expired subscription stays **readable** where the registry says so:
Nutrition Score, macro tracking and detailed statistics remain open; new scans above the
free allowance, full recipe text, favourites, portion advice, meal suggestions and the
weekly report close. Switch **Obuna: muddati tugagan** in the dev panel to see it.

### Verified flow

FREE → all nine locked with a labelled `ProLock`, tap → plan picker.
PRO → all nine functional (score 78/100 on today's entries, 20-scan allowance, favourites
persist, stats over 25 logged days, weekly report with per-day bars).
Expired → the three readable features stay, the other six re-lock.
