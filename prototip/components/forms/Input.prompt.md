The editable field used on the AI result and journal-edit screens.

```jsx
<Input label="Porsiya" value={grams} onChange={setGrams} unit="g" numeric />
<Input label="Kaloriya" value={kcal} onChange={setKcal} unit="kkal" numeric error="0 dan katta bo'lishi kerak" />
```

Errors never clear the field. Use `numeric` for every gram/kcal input so digits stay tabular.

### Blocking vs advisory

`error` is for validation that stops the flow — red hairline, red caption, primary button
disabled. `warning` is for "check this number" advice that must NOT block: grey caption,
border untouched. Both sit under the field they belong to, never in a shared block — on
O6 a plausibility warning about the *current* weight and a safety warning about the
*target* weight are two different fields' problems.

```jsx
<Input label="Joriy vazn" value={w} onChange={setW} unit="kg" numeric
  warning={implausible ? "Bu raqam odatdagidan juda uzoq — tekshirib ko'ring" : undefined}/>

<Input label="Maqsad vazn" value={t} onChange={setT} unit="kg" numeric
  error={wrongDirection ? "Vazn tashlashni tanlagansiz, lekin maqsad vazn joriysidan katta" : undefined}
  footer={wrongDirection && (
    <span style={{display:'flex',gap:8}}>
      <Button variant="tertiary" size="sm" onClick={focusField}>Raqamni to'g'rilash</Button>
      <Button variant="tertiary" size="sm" onClick={goToGoal}>Maqsadni o'zgartirish</Button>
    </span>
  )}/>
```
