import React from 'react';

export function DayGrid({ days = [], columns = 10, onDayClick, style, ...rest }) {
  // Remember which squares were already green so only a real change animates.
  const seen = React.useRef(null);
  const prev = seen.current;
  const flags = days.map((d) => (typeof d === 'object' ? Boolean(d.tracked) : Boolean(d)));
  seen.current = flags;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(' + columns + ', minmax(0,1fr))',
      gap: 'var(--space-2)', ...style,
    }} {...rest}>
      {days.map((d, i) => {
        const on = typeof d === 'object' ? d.tracked : Boolean(d);
        const label = typeof d === 'object' ? d.sana : undefined;
        const clickable = on && Boolean(onDayClick);
        return (
          <button key={i} type="button" disabled={!clickable} aria-label={label}
            onClick={clickable ? () => onDayClick(d, i) : undefined}
            style={{
              aspectRatio: '1', minWidth: 0, padding: 0, border: 0,
              borderRadius: 'var(--r-chip)',
              background: on ? 'var(--aksent)' : 'var(--chegara)',
              cursor: clickable ? 'pointer' : 'default',
              transition: 'background var(--asos) var(--ease)',
              animation: prev && on && prev[i] === false
                ? 'nutrilife-day-in var(--asos) var(--ease) both' : undefined,
            }} />
        );
      })}
    </div>
  );
}
