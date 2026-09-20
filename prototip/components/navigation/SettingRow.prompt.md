A settings list row — label on the left, current value on the right. The F2 pattern.

```jsx
<Card padded={false} style={{ overflow:'hidden' }}>
  <SettingRow title="Til" value="O'zbekcha" onClick={openLang}/>
  <SettingRow title="Vazn birligi" value="kg" onClick={openUnit}/>
  <SettingRow title="Bildirishnomalar" value="o'chirilgan" saving={busy}/>
  <SettingRow title="Hisobni o'chirish" danger onClick={openDelete}/>
</Card>
```

- The row draws no border of its own; the Card supplies the frame. Add `borderTop: 'var(--hairline)'` via `style` on every row after the first.
- `saving` replaces the value inline — per the spec the rest of the settings stay usable while one row saves.
- `error` prints the retry line beneath, keeping the old value in place.
- `danger` is for irreversible destinations only, and still routes to a confirmation screen — never acts directly.
