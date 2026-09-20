Used wherever a list or a day has no entries.

```jsx
<EmptyState icon="utensils" title="Bugun hali hech narsa qo'shilmadi"
  body="Birinchi ovqatni qo'shsangiz, doira to'lishni boshlaydi."
  actionLabel="Birinchi ovqatni qo'shish" onAction={add} />
```

For past days omit the action — you cannot log into yesterday.
