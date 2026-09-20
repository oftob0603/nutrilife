import React from 'react';

/* Translates through the app's i18n module when present, Uzbek otherwise. */
const tr = (s) => (typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s) : s);

const UZ = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

export function DayPicker({ days, value = 0, onChange, style, ...rest }) {
  const list = days || UZ.map((label, i) => ({ label: tr(label), date: 8 + i, value: i }));
  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', ...style }} {...rest}>
      {list.map((d) => {
        const on = d.value === value;
        return (
          <button key={d.value} type="button" onClick={() => onChange && onChange(d.value)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 'var(--space-1)', minHeight: 'var(--hit-min)', padding: 'var(--space-2) 0',
              border: on ? '1px solid var(--siyoh)' : 'var(--hairline)',
              borderRadius: 'var(--r-chip)', cursor: 'pointer',
              background: on ? 'var(--siyoh)' : 'var(--karta)',
              color: on ? 'var(--on-siyoh)' : 'var(--siyoh)',
            }}>
            <span style={{ font: 'var(--type-badge)', opacity: on ? 0.7 : 1, color: on ? 'inherit' : 'var(--matn-2)' }}>{d.label}</span>
            <span style={{ font: 'var(--type-caption)', fontWeight: 'var(--w-medium)', fontVariantNumeric: 'tabular-nums' }}>{d.date}</span>
          </button>
        );
      })}
    </div>
  );
}
