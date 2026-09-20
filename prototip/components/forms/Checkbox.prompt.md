Consent / opt-in checkbox — use for the onboarding O1 terms gate and any "I agree" row; never for choosing between options (that is `OptionRow`).

```jsx
<Checkbox checked={terms} onChange={setTerms}>
  <a href="#">Foydalanish shartlari</a> va <a href="#">Maxfiylik siyosati</a>ni qabul qilaman
</Checkbox>
<Button variant="primary" full disabled={!terms}>Boshlash</Button>
```

Do not stack a second checkbox for an age gate: the age is asked as a number on O4 and that is the stronger evidence — one confirmation, one place.

- Box is 24px at radius 12; checked = `--siyoh` fill with a white `check` glyph. No colour shift on hover.
- The unchecked box is transparent, which relies on the `--chegara` hairline reading against `--fon`. Over a photo or a glass panel that hairline vanishes — pass `boxFill="var(--karta)"` there (the O1 splash does).
- The tap row is the whole label, min 44px tall. Press state is `scale(0.98)`.
- `error` prints a caption in `--xato` beneath — pair it with a disabled button, never with a dialog.
