The PRO gate, in place of the content a FREE user cannot open.

```jsx
{proOpen('makro', app) ? (
  <MacroRow/>
) : (
  <ProLock compact title="Makrolarni kuzatish PRO da" onUnlock={openTariffs}/>
)}

<ProLock title="Bu retsept PRO obunada"
  caption="7 masalliq va 6 qadam ochiladi"
  onUnlock={openTariffs}/>
```

- `compact` is a single 44px row — use it where a small block is gated (the macro bars).
  The full card is for a whole screen's worth of content (recipe detail).
- Always name what is behind the lock. A gate that hides the fact that something exists
  reads as a bug, not a paywall.
- Feature ids and their gating live in `ui_kits/shared/pro.js` — read `proOpen(id, app)`
  rather than testing `isPro` directly, so expired-subscription read access is honoured.
