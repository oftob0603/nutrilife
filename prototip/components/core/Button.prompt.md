Pill-shaped action button; use `primary` for the single main action on a screen and `secondary`/`tertiary` for everything else.

```jsx
<Button variant="primary" full onClick={save}>Jurnalga qo'shish</Button>
<Button variant="secondary" size="sm">Qayta urinish</Button>
<Button variant="tertiary">Bekor qilish</Button>
<Button variant="pro" full onClick={openTariffs}>PRO ni ochish</Button>
```

`variant="pro"` is the blue→purple→pink gradient and is reserved for CTAs that open the
paywall — it is the only gradient in the system, so using it on an ordinary button spends
the distinction. Geometry is identical to `primary`; only the fill and label colour differ.

- Height is 52 (`md`) or 44 (`sm`); radius is always `--r-pill`.
- `loading` puts the spinner *inside* the button — NutriLife never covers a screen with a loader.
- `accent` (lime) is reserved for confirm actions in the add-food flow (E5, E7) and must be the only lime-filled element on screen.
