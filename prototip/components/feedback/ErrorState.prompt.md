Shows what went wrong in plain language plus what to do next — never a code, stack or "500".

```jsx
<ErrorState title="Tahlil qilib bo'lmadi" body="Internet aloqasi uzildi."
  onRetry={retry} altLabel="Qo'lda qo'shish" onAlt={manual} />
<ErrorState inline title="Saqlanmadi. Qayta urinish" onRetry={save} />
```
