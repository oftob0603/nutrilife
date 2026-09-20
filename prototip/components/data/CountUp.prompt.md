An animating number. Use for results and measurements — never for a live-updating counter that changes constantly.

```jsx
<CountUp value={465} from={0} suffix=" kkal" style={{ font:'var(--type-ring)' }}/>
<CountUp value={85.0} decimals={1} format={(n)=>n.toFixed(1).replace('.', ',')} suffix=" kg"/>
```

- Mounting animates from the initial value (no jump from zero) unless you pass `from` — the AI result passes `from={0}`, the weight figure does not.
- Duration comes from `--count-duration`; pass `duration` only to override it.
- `format` receives the interpolated value each frame — use it for comma decimals and thousands separators.
- Under `prefers-reduced-motion` the value appears immediately.
- Do not stack it with a scale animation on the same element; one emphasis at a time.
