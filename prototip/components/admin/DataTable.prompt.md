Every list in the admin panel (A2, A4, A6, A8, A11) — a CSS-grid table with hairline rows.

```jsx
<DataTable
  columns={[
    { key:'ism', label:'Ism', width:'2fr' },
    { key:'tgid', label:'Telegram ID', numeric:true, muted:true },
    { key:'rol', label:'Rol', render:r => <Badge tone={r.pro?'ai':'neutral'}>{r.rol}</Badge> },
    { key:'skan', label:'Skanlar', align:'right', numeric:true },
  ]}
  rows={users} onRowClick={openUser} loading={busy}
  empty={<EmptyState title={`«${q}» bo'yicha foydalanuvchi topilmadi`}/>}
  footer={<><span>50 tadan 1–50</span><Button variant="tertiary" size="sm">Keyingi</Button></>}/>
```

- No zebra rows, no shadow — a hairline per row and the card border, per DESIGN.md.
- `loading` draws skeleton bars in place of the body; the header stays so the layout does not jump.
- Always pass `empty`. An empty suggestion queue is good news and must read that way ("Navbat bo'sh"), not as an error.
