# UI kit — admin panel (A0–A12)

Click-through recreation of `uploads/admin-tz.md`. A separate desktop page at `/admin`,
min 1024px — **not** a Telegram Mini App screen. Same tokens as the app, wider layout.

Open `index.html`. The right panel switches between the login screen, the access-denied
screen and the panel, and toggles the loading and empty-queue states. Table rows open
their detail screens.

| File | What it holds |
|---|---|
| `data.jsx` | The eight sections of §2 and sample content — users, suggestions, dishes, the admin log, prices. **Recipes come from `../shared/recipes.js`** and **support threads from `../shared/support.js`**, the stores the mobile app also reads |
| `shell.jsx` | `Shell` (rail + scrolling content), `Page` (title row), `Toolbar`, `Field` |
| `screens-dash.jsx` | A1 dashboard (four counters, three work queues, last 10 log entries), A10 statistics, A12 prices |
| `screens-users.jsx` | A2 list with search + FREE/PRO/blocked filters and 50-per-page footer, A3 user card with all five actions |
| `screens-queue.jsx` | A4 suggestion queue (oldest first), A5 three-column review, A11 So'rovlar — request list beside a per-user chat thread. Threads come from `../shared/support.js`, the same store the mobile app's «Yordam» chat writes to |
| `screens-content.jsx` | A6 dish database, A7 dish editor with the 20% macro check, A8 recipe list, A9 recipe editor (per-language name, ingredients and steps) |
| `app.jsx` | A0 login / access denied, routing, state panel |

## Rules the kit enforces

- **Every irreversible action has a dialog that states the consequence** (§4). Deleting a
  user additionally requires typing their name; grant-PRO, extend, revoke, block and
  delete all require a reason before the confirm button enables.
- **Manually granted PRO is marked `manba = qolda`** on A3 and labelled as excluded from
  revenue statistics.
- **Blocking ≠ deleting** — A3 states the difference in each dialog.
- **Empty queue is success**: A4's empty state reads "Navbat bo'sh. Yangi tuzatishlar shu
  yerda paydo bo'ladi", not an error.
- **Approving a suggestion demands all three languages** before the confirm enables.
- **A7 warns when `4×oqsil + 9×yog' + 4×uglevod` differs from the entered calories by more
  than 20%** — a warning, not a block.
- **A12's confirm dialog says in writing that price changes do not touch existing
  subscriptions.**
- **A9 shows which fields are FREE-visible** (title, cooking time) and which sit behind PRO.
- **Photos appear only in the suggestion queue** (§4) — never in the log or the user card.
- **Panel UI is Uzbek only**; content is entered in three languages.

## Recipes are a shared store

A8 and A9 read and edit `ui_kits/shared/recipes.js`. The mobile app's Retseptlar tab reads
the same file, so what the admin publishes is exactly what the app shows:

- `holat` decides visibility — `Qoralama` stays admin-only.
- `qadamlar` may be empty; A9 says so under the field ("ilovada «Tayyorlash» bo'limi
  umuman chiqmaydi") and the app omits the section rather than rendering an empty one.
- `nomi`, `masalliqlar` and `qadamlar` are per-language objects, matching A9's language tabs.
- A8's "Mazmuni" column reports the ingredient and step counts, so a recipe published
  without preparation is visible as such from the list.

## Faithfulness notes

- Section counts on the rail are fed by sample data; zero renders no pill.
- A10's charts are plotted from sample series — the TZ names the five metrics but no
  chart style, so they are drawn as plain ink lines with no axes or gridlines.
- Photo slots render the `--chegara` placeholder box: no imagery was supplied.
- Telegram Login Widget is represented by a button; the real widget is an external embed.
- Open question 1 of the TZ (widget vs Mini App) is unresolved — the kit builds the widget
  route the TZ proposes, and it is flagged there as needing approval.
