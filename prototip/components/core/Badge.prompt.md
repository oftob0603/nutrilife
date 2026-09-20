Small pill label; the `ai` tone is the product-critical "AI taxmini" marker.

```jsx
<Badge tone="ai">AI taxmini</Badge>
<Badge tone="pro">PRO</Badge>
<Badge tone="neutral">Nonushta</Badge>
```

Sentence case, 11/500, never uppercase. The AI badge travels with the number everywhere it appears (result screen, journal row, edit screen).

Every PRO label in the user app uses `tone="pro"` — the same gradient as
`Button variant="pro"`, so a PRO mark reads identically as badge or CTA. The admin
panel's PRO *role* badges stay `tone="ai"`: that table is a different product surface.

A PRO badge shown to a non-PRO user is a tap target, not decoration — pass `onClick`:

```jsx
<Badge tone="ai" onClick={app.openTariffs}>PRO</Badge>
```

Route it through the app's single tariffs handler, never a local navigation call, so every
PRO surface in the app lands in the same place. A PRO badge on a screen the user already
has access to (the F1 role card when they are subscribed) stays a plain `<span>`.
