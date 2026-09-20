# NutriLife — full prototype

`index.html` is the whole product in one page: onboarding → Home → scan → recipes →
statistics → profile → PRO. It is the runnable prototype; the other kits in `ui_kits/`
remain the per-surface references.

## What the shell does — and what it deliberately does not

The shell (`shell.jsx`) contains no UI of its own. Every screen you see belongs to an
existing kit, loaded unmodified:

| Surface | Source |
|---|---|
| Onboarding O1–O13 | `../onboarding/screens-a/b/c.jsx` |
| Admin panel A0–A12 | `../admin/index.html`, mounted in a frame |
| App (Home, scan, recipes, statistics, profile) | `../mobile-app/*` |
| PRO tariffs + payment | `../paywall/Tariffs.jsx`, `../paywall/PaymentMethod.jsx` |
| PRO registry, recipe store | `../shared/pro.js`, `../shared/recipes.js` |

What the shell adds is only what a standalone kit cannot have: one persisted session, one
set of numbers flowing from onboarding into the app, and PRO purchases landing back where
they were triggered.

## Surfaces

A tab pair at the top switches between the two surfaces:

- **Mobil ilova** — the phone, and the whole user journey.
- **Admin panel** — the desktop operator surface, at its 1340px design width scaled to
  0.58 to sit beside the phone.

The admin kit is mounted as a frame over its own `index.html` rather than loaded into this
page. Both kits declare module-level globals (`data.jsx`, screen modules, `fmt` helpers)
and loading them side by side would collide. The frame keeps them isolated, which is also
why switching surfaces cannot disturb the mobile session — the phone stays mounted behind
it, and the admin panel is the same build that ships standalone.

## Recipe data flow

Both surfaces read `../shared/recipes.js` — `publishedRecipes()`, `recipeById()`,
`hasSteps()`. Nothing is duplicated or hardcoded in either kit: the admin content screens
and the app's Retseptlar tab describe the same array. **Runtime admin edits stay inside
the admin frame**, because the shared store is a module array with no persistence layer;
editing a recipe in the panel does not push it into the running phone. Making that flow
live needs a persistence layer on the shared store, which is a deliberate open item rather
than an oversight.

## Session and resume

Onboarding completion writes `nutrilife.session` to localStorage. On load:

- **session present** → mounts the app at Home
- **no session** → mounts onboarding at O1

So a reload resumes at Home, and onboarding reappears only for a user who has not finished
it or who taps **Prototipni qayta boshlash** (clears the session and the PRO status).

## Onboarding answers become the app's numbers

`applyAnswers(d)` runs `normaHisobi()` on the answers and writes the result onto the app
kit's `GOALS`, `PROFILE` and `WEIGHTS[0]`. The app's screens read those as module globals
rather than through props, so writing them before mount is what makes the user's own
figures appear everywhere they are derived — the daily ring's denominator, the macro bar
goals, Nutrition Score's target shares, the statistics thresholds, the profile rows and
the weight chart's first point. It is applied synchronously on first render of a resumed
session, so Home never paints sample numbers and then corrects itself.

## PRO

Any PRO-gated tap calls `onTariffs(featureId)`, and the shell mounts the paywall as an
overlay on the same phone — a screen in the same session, not a page navigation, so the
app's state survives the round trip. Completing a payment calls `writeProStatus('pro')`
and closes the overlay; the app re-reads the status and all nine features are open on
return. There is no intermediate benefits screen: a PRO tap goes straight to the plan
picker.

Standalone `../paywall/index.html` still works as its own page — the app kit falls back to
that URL when it is running without the shell.

## Kit changes this required

Three small, backwards-compatible edits; no kit was rebuilt.

1. `mobile-app/app.jsx` takes `embedded` and `onTariffs` props. `embedded` hides the kit's
   own scaffolding panel (the shell provides the chrome); `onTariffs` redirects the paywall
   from a page navigation to the shell. With no props the kit behaves exactly as before.
2. `onboarding/flow.jsx` renamed its goal list `GOALS` → `MAQSADLAR`. The app kit's `GOALS`
   is the daily calorie/macro target, and the shell loads both kits into one page, so the
   two globals collided.
3. `onboarding/screens-c.jsx` O13 routes its PRO button through `app.openTariffs` when the
   shell supplies it.

## Known gaps

The scan is a fixed-timing mock with a canned result — there is no model call. Recipes come
from `shared/recipes.js` (the admin panel's store) rather than a server. Payment grants PRO
locally with no provider involved.
