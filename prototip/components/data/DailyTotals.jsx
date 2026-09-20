import React from 'react';

/* Translates through the app's i18n module when present, and returns the Uzbek source
   otherwise — so this component still renders standalone in its design-system card. */
const tr = (s) => (typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s) : s);
const tr1 = (s, ...a) => (typeof window !== 'undefined' && typeof window.t1 === 'function' ? window.t1(s, ...a) : String(s).replace(/\{(\d)\}/g, (m, i) => (a[i] != null ? a[i] : m)));

export function DailyTotals({ kcal = 0, goal, macros = [], style, ...rest }) {
  const fmt = (n) => n.toLocaleString('ru-RU').replace(/\u00a0/g, ',');
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
      background: 'var(--karta)', border: 'var(--hairline)',
      borderRadius: 'var(--r-card)', padding: 'var(--card-padding)', ...style,
    }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 'var(--w-semibold)', fontSize: 28,
          letterSpacing: 'var(--ls-title)', fontVariantNumeric: 'tabular-nums',
        }}>{fmt(kcal)}</span>
        <span style={{ font: 'var(--type-caption)', color: 'var(--matn-2)', fontVariantNumeric: 'tabular-nums' }}>
          {goal ? tr('kkal') + ' \u00b7 ' + tr1('{0} dan', fmt(goal)) : tr('kkal')}
        </span>
      </div>
      {macros.length > 0 && (
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          {macros.map((m) => (
            <span key={m.label} style={{ font: 'var(--type-caption)', color: 'var(--matn-2)', fontVariantNumeric: 'tabular-nums' }}>
              {m.label} <span style={{ color: 'var(--siyoh)' }}>{m.value} g</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
