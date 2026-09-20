One-of-four picker, used for meal type on E5, E7 and E10.

```jsx
<SegmentedControl options={["Nonushta","Tushlik","Kechki","Gazak"]} value={meal} onChange={setMeal} />
```

Keep labels to one word each; four is the maximum that fits a 360px screen.
