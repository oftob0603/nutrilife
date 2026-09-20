# UI kit — onboarding (O1–O12)

Click-through recreation of the first-run flow specified in `uploads/onboarding-tz-86deeb0d.md`:
Telegram open → consent → name → goal → gender/age → measurements → activity →
food preferences → eating habits → motivation → plan computing → result (2 parts) →
paywall slot → Home.

Open `index.html`. The right-hand panel jumps to any screen and toggles the O9 save-error state.

| File | What it holds |
|---|---|
| `flow.jsx` | Option sets from the TZ (goals + adjustments, activity coefficients, preferences, motives), `normaHisobi()` — Mifflin-St Jeor × activity × goal with the 1,500 / 1,200 kcal floor and the 25/30/45 (30/25/45 for muscle) macro split — and `olchovTekshiruvi()`, the O6 validation set |
| `step.jsx` | `Step` shell: `StepProgress` header, scrolling question, pinned primary button above the keyboard line |
| `screens-a.jsx` | O1 splash: the supplied poster (`assets/onboarding-intro.png`) full-bleed with the terms consent in a bottom panel, then O2 name, O3 goal, O4 gender/age — where the 18+ confirmation happens — O5 measurements with all three validation layers |
| `screens-b.jsx` | O6 activity, O7 preferences (multi, "Cheklov yo'q" clears the rest), O8 habits, O9 motivation — O7–O9 carry the skip affordance |
| `screens-c.jsx` | O10 computing (2.8s, no back button, never says "AI"), O11 result part 1 (number + "Nega shunday?") and part 2 (macros + forecast + disclaimer), O12 paywall slot, Home stub with the computed ring denominator |

## O5 — three checks that never mix

Per §2, each message sits under the field it is about, and only one of the three blocks:

| # | Check | Field | Blocks? |
|---|---|---|---|
| 1 | Direction: target must agree with the O4 goal | Maqsad vazn | **yes** — with two exits: "Raqamni to'g'rilash" clears the field, "Maqsadni o'zgartirish" returns to O3 with every other answer intact |
| 1b | Target within 1 kg of current | Maqsad vazn | no — suggests "Vaznni saqlash" with a link to O3 |
| 2 | Current weight plausibility (BMI < 16 or > 50) | Joriy vazn | no — "check this number", a typo warning, not a goal warning |
| 3 | Target safety (BMI < 18,5 or target < 75% of current) | Maqsad vazn | no — the doctor notice; the kcal floor still applies at O11 |

"Vaznni saqlash" hides the target field entirely, so checks 1, 1b and 3 do not exist on that path.
`Input` gained `warning` (grey, advisory, border untouched) and `footer` (the two exit actions) for this.

## Palette note on O1

O1's splash panel uses the emerald tokens (`--yashil-fon`, `--yashil-chegara`), which are
now used by this screen alone — the primary CTA is the brand lime `--aksent`. The button
therefore renders lime on an emerald-tinted panel, and still carries an emerald-tinted
shadow; both were specified that way and are left as given. The button is pill-shaped like
every other primary CTA (its old 17px radius override is gone), so the shadow is now O1's
only remaining departure from the system, which otherwise has none.
Its `#0F1C14` / `#3F5347` text colours are local to the splash panel.

## Faithfulness notes

- The O1 poster was supplied by the user. It carries **NutriLiferobot** branding and a bright 3D illustration style, neither of which matches the rest of this system (plain NutriLife wordmark, monochrome ink, no illustration) — flagged, not altered.
- **Language selection was removed** at the user's request: the interface follows the Telegram client language and can be changed later in Settings. The flow is 12 steps, not 13.
- The 18+ gate is a **number on O4**, not a checkbox on O1 — per the TZ, the entered age is the stronger evidence and asking twice is doing one job twice. O1 carries the terms checkbox alone.
- O12's internals are **not** in the TZ, so the screen shows its role in the flow plus the "Hozir emas" exit — nothing was invented for it.
- The imperial toggle changes the unit suffix only; conversion is out of scope for a visual kit.
- O10 shows a spinner + rotating lines, per spec; the real calculation takes ~100ms and the wait is deliberate.
- O1 carries `assets/onboarding-intro.png`, supplied by the user: a four-goal collage (Ozish · Vazn olish · Sog'lom turmush tarzi · Vaznni saqlash). Note it is branded **NutriLiferobot** and uses a 3D-render, multi-colour pastel style that does not match the NutriLife ink/lime system — flagged for replacement rather than silently restyled.
- No other food photography or icon set was supplied — Lucide glyphs stand in, per readme.md.
