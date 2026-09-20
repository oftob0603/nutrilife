Gives an arbitrary element the standard press response. Reach for it when a component does not already have one — `Button`, `Chip`, `OptionRow`, `SettingRow` and `Card` (when clickable) already do.

```jsx
<Pressable as="div" onClick={open} style={{ padding:'var(--card-padding)' }}>…</Pressable>
<Pressable scale="var(--press-scale-fab)" spring aria-label="Qo'shish">＋</Pressable>
```

- Three scales exist by design: rows and cards 0.98, buttons 0.97, the centre + 0.92. Do not invent a fourth.
- `spring` is for the centre + only. Everywhere else uses `--ease`.
- The press state is transform-only, so it composites cheaply on mobile.
