The admin panel's permanent left rail — one per page, never used in the mobile app.

```jsx
<SidebarNav value={section} onChange={setSection} items={[
  { id:'a1', label:'Boshqaruv paneli', icon:'layout-dashboard' },
  { id:'a4', label:'Takliflar navbati', icon:'inbox', count:7 },
  { id:'a11', label:'Shikoyatlar', icon:'message-square-warning', count:2 },
]}/>
```

- Active item = `--fon` fill, ink text, card-title weight. Inactive = `--matn-2`, no fill.
- `count` is an accent pill and appears only when work is waiting; zero renders nothing (an empty queue is success, not a state to advertise).
- 240px fixed. The rail is never collapsed — the panel assumes ≥1024px.
