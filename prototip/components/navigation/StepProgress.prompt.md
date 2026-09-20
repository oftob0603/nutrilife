Top-of-screen progress header for a multi-step flow — the onboarding counterpart of `ScreenHeader`.

```jsx
<StepProgress step={7} total={12} onBack={prev} onSkip={next} />
```

- Counter reads "{total} dan {step}" in `--matn-2`, tabular-nums.
- Track is 4px, `--chegara` unfilled, `--siyoh` filled, animated at `--asos`.
- `onSkip` belongs only on steps that do not feed the calorie formula (O7, O8, O9). Drop `onBack` on O10, where returning is not allowed.
