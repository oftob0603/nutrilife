The weight line on the Progress screen (P1). Deliberately minimal: one line, one dashed goal reference, tappable points.

```jsx
<WeightChart points={measurements} goal={82} height={160}
  onPointClick={(p)=>console.log(p.sana, p.kg)}/>
```

- With fewer than two points it renders the empty message instead of a chart — after onboarding there is exactly one measurement, and a single dot is not a trend.
- Tapping a point shows its date and value beneath the chart; it never navigates.
- Never add a BMI band, a "healthy range" shading, or a forecast line. The spec forbids interpreting the number.
