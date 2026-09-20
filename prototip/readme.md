# NutriLife — Design System

NutriLife is a **calorie-tracking mobile app for Uzbekistan**. You point your phone at a
plate of osh, somsa or lagmon, the app estimates calories and macros with AI, you confirm
the estimate, and a single ring on the home screen fills up toward your daily goal. A
free tier allows a handful of AI scans per day; manual entry from a dish database is
unlimited; a PRO tier unlocks recipes and deeper progress tracking.

The interface language is Uzbek, with Russian and English planned (Russian copy runs
roughly 20% longer — every layout must survive that).

## Sources

Everything in this design system was derived from two documents supplied by the
NutriLife team. No codebase, Figma file, logo or photography was provided.

| Source | What it gave us |
|---|---|
| `uploads/DESIGN.md` | The complete visual specification: colour tokens (light + dark), type scale, radius set, 4px spacing scale, the no-shadow depth rule, component rules, tone-of-voice table, motion tokens, and a per-screen QA checklist. The chosen direction is named in it: **"A — qat'iy asbob"** (a strict instrument). |
| `uploads/onboarding-tz.md` | The first-run flow: screens O1–O13, per-screen fields and validation, the skip rules (O8–O10 only), state table, the Mifflin-St Jeor norm formula with its 1,500 / 1,200 kcal floor and the 25/30/45 macro split. |
| `uploads/progress-tz.md` | The Progress tab: P1–P3, the fixed definitions of tracked day / streak / streak break, the weight-entry rules, and the explicit list of what must never be shown (BMI, healthy-range band, forecast, comparisons). |
| `uploads/profil-tz-ffb78d8a.md` | The Profil tab: F1–F5, the three subscription-role cards, the settings inventory, the units-are-display-only rule, the norm-change confirmation, and the two-step account deletion. |
| `uploads/admin-tz.md` | The desktop admin panel: screens A0–A12, the eight sections of the left rail, the action log requirement, mandatory reason fields, and the block-vs-delete distinction. |
| `uploads/dizayn-tz.md` | The screen spec for the heart flow: screens E1–E10, the flow map, global bottom-bar navigation, per-screen elements / navigation / loading / empty / error states, sprint sequencing, and open design questions. |

Both documents reference a PRD (sections 2, 3, 4, 5, 8) that was **not** supplied. Where
this system cites PRD behaviour it is quoting the two docs above, not the PRD itself.

Referenced in the source footers: `vibecoding.uz`.

### Deliberately out of scope

`dizayn-tz.md` excludes AI plan generation, paywall and payment,
the progress page, recipes, settings, the admin panel and the Telegram bot screens.
Onboarding has since arrived as `onboarding-tz.md` and is built as its own UI kit. The
admin panel has since arrived as `admin-tz.md` and is built as its own UI kit. The
Progress and Profil have since arrived as `progress-tz.md` and `profil-tz-ffb78d8a.md`
and are built into the mobile kit. The remaining areas are covered by separate specs that
were not provided, so this system
contains no components or screens for them — the bottom bar keeps their slots, nothing
more. O13's paywall internals are explicitly deferred in the TZ, so that screen shows
only its place in the flow.

---

## Index

| Path | What it is |
|---|---|
| `styles.css` | The single entry point consumers link. `@import` lines only. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `base.css` |
| `guidelines/` | Foundation specimen cards (`*.card.html`) plus `keyframes.css` — the three animations the brand allows |
| `components/core/` | `Button`, `Card`, `Badge`, `Chip`, `Icon`, `Pressable` |
| `components/forms/` | `Input`, `SearchField`, `SegmentedControl`, `DayPicker`, `Checkbox`, `OptionRow` |
| `components/data/` | `DailyRing`, `MacroBar`, `FoodImage`, `LogEntry`, `DailyTotals`, `WeightChart`, `DayGrid`, `CountUp` |
| `components/feedback/` | `Skeleton`, `Spinner`, `EmptyState`, `ErrorState`, `OfflineBar`, `Note`, `ProLock` |
| `components/navigation/` | `ScreenHeader`, `StepProgress`, `BottomBar`, `BottomSheet`, `ActionRow`, `SettingRow` |
| `components/admin/` | `SidebarNav`, `DataTable`, `StatTile`, `Modal`, `Textarea`, `Select` — desktop only, for the `/admin` panel |
| `ui_kits/prototype/` | **The runnable prototype** — onboarding → Home → scan → recipes → statistics → profile → PRO in one page with a persisted session; mounts the other kits unmodified. See its own `README.md` |
| `ui_kits/mobile-app/` | Click-through recreation of screens E1–E10 — see its own `README.md` |
| `ui_kits/onboarding/` | Click-through recreation of the first-run flow O1–O12 — see its own `README.md` |
| `ui_kits/admin/` | Click-through recreation of the desktop admin panel A0–A12 — see its own `README.md` |
| `ui_kits/shared/pro.js` | The PRO feature registry both kits read: the nine features, the per-plan scan allowance, `proOpen()`, and the persisted subscription status |
| `ui_kits/shared/recipes.js` | The recipe store both kits read: admin A8/A9 edit it, the app's Retseptlar tab renders it |
| `assets/` | *(empty — no logo, icons or photography were supplied; see Iconography and Assets)* |
| `SKILL.md` | Agent-Skills front matter so this folder works as a Claude Code skill |

Every component directory ships `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md` and one
`*.card.html` specimen.

### Intentional additions

The source documents name components by behaviour rather than by a component inventory,
so the list above is a direct reading of `DESIGN.md` §6 plus the element lists in
`dizayn-tz.md` §3. Two items have no named counterpart in the sources:

- **`Icon`** — a wrapper around the substituted Lucide glyph set. Needed because the
  sources describe icons ("nishon", "mitti rasm", the 20px-icon/44px-target rule) without
  shipping any.
- **`Note`** — the quiet explanation card behind O6's low-goal safety notice, O12's
  "Nega shunday?" disclosure and the "not medical advice" line. `onboarding-tz.md`
  specifies the copy and the behaviour but names no component.
- **`DailyTotals`** — the journal's "kunlik jami: kaloriya va uch makro" row (E9). Split
  out of the screen because Home will need the same summary when Progress lands.

Nothing else was invented. There is no Toast, Avatar, Tooltip, Tabs or Dialog here,
because the sources define none — errors are inline, confirmation is a card (E10), and
choices are bottom sheets.

---

## Content fundamentals

The voice is **calm, exact and joyless on purpose**. NutriLife is positioned as an
instrument, not a coach, and the copy is what carries that positioning.

**Rules, verbatim from the source:**

- **No exclamation marks. No emoji in the interface.** The only colourful thing on screen
  is the food photo.
- **Sentence case everywhere** — "Jurnalga qo'shish", never "Jurnalga Qo'shish" and never
  ALL CAPS. Badges included: "AI taxmini", not "AI TAXMINI".
- **No technical text is ever shown**: no error codes, no stack traces, no "error", no
  "null", no "500".
- **Every error message is two parts**: what happened + what to do next.
- **The user is never blamed.** "Bu rasmdan taomni ajrata olmadik" — not "Rasm noto'g'ri".
- **The word "taxminiy" (approximate) never disappears** from anywhere a number appears.
  Product positioning depends on it, and the "AI taxmini" badge travels with every
  AI-produced figure — in the journal, on the result screen, in the editor.
- **Every empty state has three parts**: what is missing, why, and one action. A bare
  "Ma'lumot yo'q" is unacceptable.
- **Every icon carries a label.** An icon alone is not understood.

| Write this | Not this |
|---|---|
| Jurnalga qo'shildi | Ajoyib! Muvaffaqiyatli qo'shildi 🎉 |
| Taomni aniq taniy olmadik | Xatolik yuz berdi (500) |
| Bugun hali hech narsa qo'shilmadi | Ma'lumot yo'q |
| Raqamlar taxminiy | Aniq hisoblangan |
| Saqlanmadi. Qayta urinish | Saqlash amalga oshmadi |
| Internet yo'q — oxirgi ma'lumot ko'rsatilmoqda | Offline mode |

Numbers are always written with their unit in secondary text: `1,240` in ink, `kkal` in
`--matn-2`. Thousands use a comma. Portions read "250 g", "1 dona", "2 bo'lak".

Address the user in second person only when giving an instruction ("Taomni tepadan,
to'liq ko'rinishda oling"); status text is impersonal ("Jurnalga qo'shildi"). The app
does not say "I".

---

## Visual foundations

**The direction in one line:** monochrome base, one lime accent, no shadows. The food
photograph must be the only coloured element on screen, and the interface must not fight
it.

### Colour

Eight tokens per theme, no more. `--siyoh` (#0B0B0C) does all the work: body text, big
numerals, primary button fill, active tab. `--aksent` (#C6F04C) is a lime that appears
**once per screen as a fill** — the ring arc on Home, the confirm button in the add-food
flow, the "AI taxmini" badge. It is never used as a text colour on a light background
(contrast fails); text on top of lime is `#2E3D07`, a dark shade of the same family —
neither black nor white. `--xato` is the only other hue, reserved for error text,
validation and an over-goal ring.

Colour never states a condition alone — a label or a badge always sits beside it, for
colour-blind users. Dark theme swaps the neutrals and keeps the lime unchanged. Hard-coded
hex values are forbidden: dark theme breaks the moment one appears.

### Type

**Inter Tight** for headings and numerals, **Inter** for text — both cover Latin and
Cyrillic, which Russian requires; only `latin`, `latin-ext` and `cyrillic` subsets load.
Weights are **400 / 500 / 600 only**; 700 reads as heavy and is banned. The scale is
short: ring numeral 44/600 at −0.03em, screen title 24/600 at −0.02em, card title 17/600,
body 15/400 at 1.5 line-height, caption and unit 13/400 in `--matn-2`, badge 11/500.
**Every numeral uses `font-variant-numeric: tabular-nums`** — without it the ring number
jumps and the fill animation shivers.

### Spacing and layout

4px base; the allowed set is **4 · 8 · 12 · 16 · 24 · 32 · 48** and nothing else — no 6,
10, 14 or 18. Screen gutter 16, card padding 16, card-to-card 12, block-to-block 24,
title-to-content 8, text-to-caption 4, 24 + safe area above the floating bottom bar.
**Tap targets are never smaller than 44 × 44**, even around a 20px icon. Layouts are
verified at 360px.

The only fixed elements are the floating bottom bar (shown on Home, the journal and
section roots; hidden inside the add-food flow and behind any open sheet) and the
offline strip pinned to the top of the screen.

### Backgrounds, surfaces and depth

Flat colour only. **No gradients, no blur, no neon, no 3D effects, no patterns, no
textures, no illustration.** Page is `--fon`, surfaces are `--karta`, and depth comes from
exactly three things: the background/card colour difference, a 1px `--chegara` hairline,
and whitespace. **Shadows are not used** — the single exception is the floating bottom bar
and its "+" button, at `0 4px 16px rgba(0,0,0,0.08)`. Transparency appears only as the
bottom-sheet scrim (`rgba(11,11,12,0.4)`).

### Corner radii and cards

Four values, no intermediates: **12** (chips, small badges, image thumbnails), **20**
(cards, list rows, input fields), **28** (bottom sheets, modals), **999** (buttons,
pill badges). 16 and 24 are not used. When nesting, the inner radius is **8 less** than
the outer — a 20 card holds a 12 image.

A card is therefore: `--karta` fill, radius 20, padding 16, 1px hairline (light theme
only), **no shadow**.

### Imagery

Food photography at **4:3, radius 12**, and the box is reserved with a `--chegara` fill
before load so lists never jump. List thumbnails are 48–56px squares. The photo is warm
by nature — osh, somsa, non are golden and warm-toned — and is never tinted, overlaid or
desaturated. `DESIGN.md` §10 flags an open risk here: the cool grey `#F2F2F3` page may
make warm food look dirty, and the fallback is warming the background to `#F5F3F0`
without touching any other token. **No photography was supplied**, so every image slot in
this system renders its placeholder.

### Motion

Short and rare. `--tez: 150ms`, `--asos: 250ms`, curve `cubic-bezier(0.2, 0, 0, 1)`.
Animation exists in exactly three places: the ring filling (600ms — the product's key
moment on E8), the bottom sheet opening, and page transitions. Everything else is
instant, including switching bottom-bar sections. `prefers-reduced-motion` is respected:
the ring number updates immediately with no animation. Skeletons pulse at 1.5s.

### Interaction states

- **Press:** `scale(0.98)` — on buttons, cards, chips and rows. That is the press state;
  there is no colour shift.
- **Hover:** effectively absent — this is a touch product. On pointer devices, secondary
  text links move to `--matn-2`; nothing lightens or darkens on hover.
- **Focus:** the field border moves from `--chegara` to `--siyoh`. No glow, no outline ring.
- **Selected:** an ink fill with white text (chips, day picker, active tab).
- **Disabled:** 40% opacity, and — critically — a disabled control is always accompanied
  by a line of text explaining why, plus a path that still works.
- **Loading:** never a full-screen overlay. Data loads in place as skeletons in
  `--chegara`; a tapped button carries the spinner **inside itself** and refuses a second
  tap. Spinners are allowed only inside buttons and on the camera / AI-analysis screens.
- **Error:** inline. A red-bordered strip under a form for save failures, a card in place
  of the content for load failures. Never a dialog, never a toast.

### Component-specific rules worth memorising

- **The daily ring**: 14px stroke, round caps, starts at 12 o'clock, fills clockwise.
  Unfilled track is `--chegara`. Two lines centred: big number, and `2,190 dan` beneath
  in 13/400 `--matn-2`. Over goal, the arc turns `--xato` and one caption line appears —
  no warning dialog. **The ring is an indicator, not a button.**
- **Buttons**: primary is `--siyoh` fill with white text, radius 999, height 52.
  Secondary is transparent with a 1px border. Tertiary is text only. **One primary
  button per screen.**
- **The "AI taxmini" badge**: lime fill, `#2E3D07` text, radius 999, 11/500, beside
  every AI-produced number.
- **Macro bars** fill with `--siyoh`, not lime — the ring owns the screen's only lime fill.

---

## Imagery

One supplied image lives in `assets/onboarding-intro.png` (941×1671) — the intro poster
shown full-bleed at the top of onboarding screen O1. It is the only photographic or
illustrated asset in the system. Note that it is branded **NutriLiferobot**, not NutriLife,
and its glossy 3D style sits outside the visual foundations described above; it is used
as given, unedited.

### Lime is the primary CTA

The primary button is the brand lime — the same accent as the calorie ring, so the colour
a user presses and the colour that reads "NutriLife" are the same one.

| Token | Value | Role |
|---|---|---|
| `--aksent` | `#C6F04C` | primary button fill, ring, AI badge, selected plan cards |
| `--aksent-matn` | `#2E3D07` | its on-colour — 8.9:1 on lime |
| `--aksent-fon` | `#F4FCE2` (dark: `#1C2411`) | accent at page strength, selected fills |

`--btn-primary-bg` points at `--aksent` in both themes, so every `Button variant="primary"`
follows with no per-screen styling. Three things worth knowing:

- **Pressed keeps the same hue.** There is no darker lime in the system, and adding one
  would introduce a second green, so `--btn-primary-press` is also `--aksent` and the
  press state reads through the scale transform alone. Note the cost: under
  `prefers-reduced-motion` the transform is removed, which leaves the primary button with
  no press feedback. A darker lime is the only clean fix if that matters.
- **`--on-siyoh` is a separate token, and the distinction matters.** Plenty of non-button
  elements fill with `--siyoh` and need ink on top: selected chips and option rows, the
  offline bar, checkbox ticks, the 56px add button, PRO badges, toasts. Those use
  `--on-siyoh` (`#FFFFFF` light / `#0B0B0C` dark) because **`--siyoh` inverts by theme**,
  so ink on it must invert too. `--btn-primary-fg` follows the accent instead and is
  `--aksent-matn` in both themes. Collapsing the two once painted dark-theme chips
  white-on-white at 1.12:1 — keep them separate.
- **The admin panel keeps the ink fill.** `tokens/admin.css` restores
  `--btn-primary-bg: var(--siyoh)` under `[data-admin-page]`, an attribute on the admin
  document's own `<body>` — scoped to the page rather than `[data-admin-shell]` because
  the A0 login gate renders before the shell mounts, and re-declared on
  `[data-admin-shell][data-theme=dark]` because a `var()` value resolves at the element
  that declares it, so the `<body>` rule alone would freeze the label at its light value.

**PRO tier — the one gradient.** Paid-tier CTAs use `--pro-gradient`
(`linear-gradient(90deg,#2563EB,#7C3AED,#DB2777)`) with white `--pro-fg`, through
`Button variant="pro"`. It is the only gradient in the system and is reserved for buttons
that open the paywall — «PRO ni ochish» (onboarding O13, locked recipe, every `ProLock`),
the profile upgrade CTA, and «Davom etish» in the plan picker. The same gradient marks every PRO *label* in the user app — `Badge tone="pro"` (profile
PRO pill, locked-recipe badge, every `ProLock`), the locked recipe card's corner pill,
`Chip pro` for the PRO-gated «Sevimli» filter, and the plan pill on the payment screen.
Ordinary buttons and chips keep their existing fills, and the admin panel is untouched —
its PRO *role* badges stay `tone="ai"`, since that table is a different product surface. The stops are the deep end of each hue so white
clears 4.5:1 at every point along the ramp (5.17 / 5.70 / 4.60); the lighter pinks and
purples drop to ~3.5 and would fail mid-gradient, which an end-point-only check misses.

**Open inconsistency on O1.** The emerald tokens (`--yashil`, `--yashil-fon`,
`--yashil-chegara`) are no longer used by any button; they now serve only the onboarding
splash panel, which was specified in emerald. Its button also still carries an
emerald-tinted shadow (`rgba(21,128,61,…)`) that no longer matches the lime fill sitting
on it. Left as specified rather than silently retinted — **worth a decision**: retint the
shadow to lime, or drop it.

Lime `--aksent` `#C6F04C` is unchanged and keeps its own role — the daily ring, the AI
badge, selected plan cards and selected option fills. Emerald is what a user *presses*;
lime is what the product *is*. O1 no longer hard-codes any hex: it references these
tokens and keeps only its two real exceptions, the 17px button radius and the soft green
shadow (the system is otherwise pill-radius and shadowless).

### Micro-interactions

Motion is feedback, never decoration. Everything is `opacity`/`transform` only, so it
stays on the compositor, and every keyframe has a `prefers-reduced-motion` override in
`guidelines/keyframes.css` — link that file next to `styles.css` on any page that animates.

Durations live in `tokens/motion.css`: `--tez` 150ms (presses), `--asos` 250ms (entrances,
sheets), `--chart-draw-duration` 600ms, `--count-duration` 700ms, `--scan-duration` 1400ms.
Nothing exceeds 700ms except the scan line, which loops while the user waits.

| Interaction | Treatment |
|---|---|
| Row press (`SettingRow`) | `scale(var(--press-scale))` 0.98, background to `--karta-press`, chevron slides 2px right |
| Button press | `scale(var(--press-scale-button))` 0.97 at `--tez` |
| Centre + press | `scale(var(--press-scale-fab))` 0.92 with `--ease-spring` — the one spring in the system — and the float shadow drops |
| Section navigation | `nutrilife-nav`: opacity 0→1 only, 175ms (`--nav-duration`) on `--ease-nav`. No transform — one would become the containing block for scroll surfaces and shift content against the scroll |
| Content arriving within a screen | None. Content inside a scroll surface gets no entrance animation — no fade, translate, scale or stagger — so it is stable on arrival and while scrolling. `nutrilife-rise` is retired to a no-op |
| Bottom sheet | `nutrilife-sheet-in`: slides from 100% |
| Paywall | `nutrilife-paywall-in`: opacity 0→1, no transform (same reason as `nutrilife-rise`) |
| Recipe card press | Card to 0.98, image to 1.02 — the image lifts as the card sinks |
| Weight chart | `nutrilife-draw` strokes the line left to right; points `nutrilife-pop` from `scale(0)`, staggered across the draw |
| Tracked day turning green | `nutrilife-day-in`: 0.8 → 1.1 → 1, and only on a real change — `DayGrid` remembers the previous state |
| Streak increase | `nutrilife-bump`: 1 → 1.15 → 1, fired once from `streakGrew`. Never looped, never on mount |
| Numbers | `CountUp` tweens over `--count-duration` — the AI calorie reveal from 0, the weight figure after a measurement |
| Food scan | `nutrilife-scan`: a soft `--aksent` band travels down the photo while analysis runs. The app's strongest motion, by design |
| Destructive actions | Pressed state only. Deleting an account gets no entrance animation |

Nothing pulses continuously except the `Spinner` and the scan band, both of which mean
"still working". A number never animates while the user is typing it.

## Iconography

**No icon set, sprite, icon font or SVG was supplied with the brief**, and no logo or
brand mark either. What the sources do specify is behaviour: icons sit at roughly 20px in
lists and tabs and 24px for screen-level affordances; every icon has a visible text label
under or beside it ("nishon ostida yozuv doim bor — yolg'iz ikona tushunarsiz"); a 20px
icon still gets a 44px tap target; and **emoji are not used in the interface at all**.
No Unicode characters are used as icons.

### Substitution — please confirm

- **Icons:** substituted with **[Lucide](https://lucide.dev) 0.454.0 from CDN**
  (`https://unpkg.com/lucide@0.454.0/dist/umd/lucide.js`), drawn at **stroke-width 1.75**
  and always in `currentColor`. Lucide's thin, geometric, monochrome outlines are the
  closest match to a monochrome strict-instrument interface. Glyphs in use: `camera`,
  `image`, `pencil`, `search`, `x`, `plus`, `check`, `chevron-left`, `chevron-right`,
  `trash-2`, `utensils`, `notebook-pen`, `circle-gauge`, `book-open`, `trending-up`,
  `user`. **Icons are never tinted lime.**
- **Fonts:** Inter Tight and Inter are loaded from **Google Fonts**, since no font
  binaries were supplied. These are the families the spec names, so this is a delivery
  substitution rather than a design one.
- **Logo:** none exists in the sources. Wherever a mark would go, the word **NutriLife** is
  set in Inter Tight 600 at −0.03em (see the *Wordmark (placeholder)* card). **No mark
  was drawn or reconstructed.**
- **Photography:** none supplied; all food images render the specified `--chegara`
  placeholder box.

If you have the real icon set, font binaries, a logo or food photography, drop them in
and these substitutions should be replaced.

---

## Using this system

```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="guidelines/keyframes.css">
<script src="https://unpkg.com/lucide@0.454.0/dist/umd/lucide.js"></script>
```

Then reference colour, type, spacing, radius and motion **only** through the custom
properties. The canonical token names are the Uzbek ones from `DESIGN.md`
(`--siyoh`, `--aksent`, `--fon`, `--karta`, `--matn-2`, `--matn-3`, `--chegara`,
`--xato`); English aliases (`--ink`, `--accent`, `--bg`, `--surface-card`,
`--text-secondary`, `--border-hairline`, `--danger`) resolve to the same values for
consumers who prefer them. Dark theme is `data-theme="dark"` on any ancestor.

### Pre-ship checklist (from `DESIGN.md` §9)

- [ ] Opened in both light and dark theme
- [ ] Text fits in all three languages — Russian runs ~20% longer than Uzbek
- [ ] Every tappable element is at least 44px
- [ ] No hard-coded hex values and no hard-coded strings
- [ ] Empty, loading and error states all work
- [ ] Exactly one lime-filled element and one primary button per screen
- [ ] Checked on a small phone (360px)

### Open questions carried over from the sources

1. Should E8 be its own screen, or a return to Home with the ring animating plus a
   toast? The second saves a tap. (`dizayn-tz.md` §6)
2. Is meal type auto-selected by time of day, or always manual?
3. Are portion options authored per dish, or a shared small/medium/large template?
4. Should tapping the ring open a detail view?
5. Does the cool grey page background need warming to `#F5F3F0` once real food
   photography lands? (`DESIGN.md` §10)
