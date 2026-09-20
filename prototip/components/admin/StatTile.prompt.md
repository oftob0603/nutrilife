A single number on the admin dashboard — four across the top row of A1, three for the work queues.

```jsx
<StatTile label="Bugungi skanlar" value="1,284" icon="scan-line"/>
<StatTile label="Tasdiq kutayotgan takliflar" value="7" icon="inbox" onClick={goQueue}/>
<StatTile label="Kunlik faol" loading/>
```

- The number is display type at 24px with tabular numerals; the label is a caption above it.
- A queue tile gets `onClick` and shows a chevron — a counter that leads nowhere does not.
- `loading` replaces only the number, so the grid does not reflow.
