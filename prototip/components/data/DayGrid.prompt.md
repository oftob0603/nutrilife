The tracked-days grid on Progress (P1) — 30 squares, one per day.

```jsx
<DayGrid days={last30} onDayClick={(d)=>openJournal(d.sana)}/>
```

- `--aksent` = a day with at least one confirmed entry; `--chegara` = nothing logged. Only two states, by design.
- Tapping a tracked day opens the journal at that date; untracked squares are inert (there is nothing to show).
- Never colour a day to warn about a streak about to break. Per the spec the product informs, it does not pressure.
