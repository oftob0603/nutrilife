# UI kit — PRO tariffs + payment

Two Telegram Mini App screens, React + Tailwind, one file per screen. 390px frame,
light and dark via CSS variables on `[data-theme]`. Open `index.html`; the side panel
switches the entry point, the load state and the theme.

| File | Screen |
|---|---|
| `Tariffs.jsx` | Screen 1 — header per entry point, the nine benefits, 3 plan cards, fine print, links, pinned buttons |
| `PaymentMethod.jsx` | Screen 2 — plan summary, three methods, refund note |
| `plans.jsx` | The API-shaped plan list and the price maths |
| `app.jsx` | Routing, the preserved plan selection, the demo panel |

## Prices are computed, never written

`plans.jsx` holds `{ id, nomi, price, months }` as it would arrive from the API. Every
label is derived:

- `oyiga(plan)` = price ÷ months, rounded to the nearest 100 so'm
- `tejash(plan, monthly)` = `round((1 − plan_price / (monthly_price × months)) × 100)`

With the current prices that renders "≈28,300 so'm / oy · 27% tejash" and
"≈24,200 so'm / oy · 38% tejash". Change a price and both update; no subtitle is a literal.

## Rules held

- **"Hozir emas" is always mounted** and always closes — in `ready`, `loading` and
  `error` alike. The screen is never a dead end; `Davom etish` is what disables.
- **"Yillik" is pre-selected on mount** and survives navigating to screen 2 and back.
- Exactly **one accent-filled element per screen**: the "Tavsiya etiladi" badge on
  screen 1, the "PRO" chip on screen 2. Text on accent is `#2E3D07`.
- Selected plan card is a 2px accent border on an accent tint; unselected is a 1px
  border on card. No shadow, no gradient, no blur anywhere.
- The scan limit is stated as **"Kuniga 20 tagacha"**. The word "limitsiz" appears nowhere.
- No countdown, no "faqat bugun", no auto-renewal wording — the fine print says the user
  extends it manually.
- Every tap target is ≥44px; radii are 12 / 20 / 28 / 999 only; weights are 400/500/600.

## Substitutions to flag

- **No payment-provider logos were supplied.** Each method row has an explicit 44px logo
  slot showing a two-letter stand-in. Drop in Click / Payme / Telegram Stars marks and the
  layout takes them as-is.
- Benefit and chevron icons are Lucide 0.454.0 via the design-system `Icon` component,
  consistent with the rest of the kits.
- The selected-card background is `--aksent-fon` (`#F4FCE2` light, `#1C2411` dark), now a
  real token in `tokens/colors.css` and aliased here as `--accent-tint`. It was not in the
  brief's palette — the accent at page strength was needed for the selected state.
- This screen declares **no colours of its own**: `index.html` aliases `--ink`, `--page`,
  `--card` and friends onto the design-system tokens, so light and dark match the app.

## The nine PRO features

`ui_kits/shared/pro.js` is the single registry. This screen's benefit list is **built from
it** (`BENEFITS = PRO_FEATURES.map(...)`), so the paywall cannot advertise something the
app does not gate — all nine are implemented and gated in `ui_kits/mobile-app`. See that
kit's README for where each one lives.

Completing a payment calls `writeProStatus('pro', plan)`, which is what the app reads on
load — so subscribing here unlocks all nine features there. The confirmation offers
**Ilovaga qaytish** plus a test-only cancel that writes the status back to `free`.
