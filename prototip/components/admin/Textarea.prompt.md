Multi-line text for the admin panel — reason fields, ingredient lists, cooking steps.

```jsx
<Textarea label="Sabab" required rows={3} value={reason} onChange={setReason}
  hint="Keyin o'zingiz eslay olasiz: test, kompensatsiya, sovg'a"/>
```

- Matches `Input`: radius 20, hairline, ink border on focus, red border + caption on error.
- `required` marks the reason fields that §4 makes mandatory; pair with a disabled confirm button.
- Vertical resize only — horizontal resize breaks the panel grid.
