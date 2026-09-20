One choice in a vertical list of choices — the onboarding question pattern (O4 goal, O5 gender, O7 activity, O8 preferences, O9 habits, O10 motivation).

```jsx
<div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
  {GOALS.map(g => (
    <OptionRow key={g.value} label={g.label} caption={g.caption}
      selected={goal === g.value} onClick={() => setGoal(g.value)} />
  ))}
</div>
```

- Radius 20, padding 16, 1px hairline, no shadow. Selected = `--siyoh` fill, white text, `check` glyph.
- `multi` only swaps the ARIA role; the visual selected state is identical (O8 allows several).
- Use `SegmentedControl` instead when the options are 2-4 short words on one line.
