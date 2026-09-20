Desktop confirmation / form dialog for the admin panel. The mobile app never uses it — there, a sheet slides up from the bottom.

```jsx
<Modal open={del} onClose={close} danger
  title="Ma'lumotini o'chirish"
  description="Profil, jurnal va rasmlar butunlay o'chadi. Bu amalni qaytarib bo'lmaydi."
  confirmLabel="O'chirish" confirmDisabled={typed !== user.ism} onConfirm={remove}>
  <Input label={`Tasdiqlash uchun «${user.ism}» deb yozing`} value={typed} onChange={setTyped}/>
  <Textarea label="Sabab" required value={reason} onChange={setReason}/>
</Modal>
```

- `danger` turns the confirm button red; use it only where the TZ calls the action irreversible.
- `description` is not decoration — §4 requires the consequence in writing.
- Reason fields are mandatory for grant-PRO, block and delete; keep `confirmDisabled` wired to them.
