Dropdown for admin forms where the option list is long or boring (category, tariff, difficulty).

```jsx
<Select label="Kategoriya" value={cat} onChange={setCat}
  options={['Birinchi taom','Ikkinchi taom','Non','Salat','Shirinlik','Ichimlik']}/>
```

- Do not use this in the mobile app: short option sets there are `SegmentedControl`, long ones `OptionRow` lists.
- Native `<select>` underneath, so keyboard and OS pickers work; only the chrome is restyled.
