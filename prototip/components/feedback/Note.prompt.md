Inline explanation or soft warning card — use where the product must explain a number or caution the user without blocking them.

```jsx
<Note tone="warn" title="Bu maqsad vazni bo'yingizga nisbatan pastroq bo'lishi mumkin">
  Bu tibbiy maslahat emas!
</Note>

<Note collapsible title="Nega shunday?">
  Bo'y, vazn, yosh, jins va faollikdan kunlik sarf hisoblandi, keyin maqsadga qarab tuzatildi.
</Note>
```

- `warn` uses an `--xato` hairline and a `triangle-alert` glyph; body text stays `--siyoh` so it is not a red wall.
- `info` is a plain hairline card with `--matn-2` body.
- A warn note never blocks the flow — the primary button stays enabled beneath it.
