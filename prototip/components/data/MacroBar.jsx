import React from 'react';

/* Translates through the app's i18n module when present, Uzbek otherwise. */
const tr = (s) => (typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s) : s);

/* Fill colour is keyed off the label so every caller — Home's macro row, the Nutrition
   Score breakdown, recipes, statistics — gets the same hue for the same macro without
   passing a prop. The tokens resolve to ink in light mode and to distinct hues in dark. */
function macroFill(label = '') {
  if (/oqsil/i.test(label)) return 'var(--makro-oqsil)';
  if (/yog/i.test(label)) return 'var(--makro-yog)';
  if (/uglevod/i.test(label)) return 'var(--makro-uglevod)';
  if (/norma/i.test(label)) return 'var(--makro-norma)';
  return 'var(--siyoh)';
}

export function MacroBar({ label, value = 0, goal = 100, unit = 'g', style, ...rest }) {
  const pct = goal > 0 ? Math.min(100, (value / goal) * 100) : 0;
  const fill = macroFill(label);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', flex: 1, minWidth: 0, ...style }} {...rest}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <span style={{ font: 'var(--type-caption)', color: 'var(--matn-2)', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={{ font: 'var(--type-caption)', color: 'var(--siyoh)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {value} / {goal} {tr(unit)}
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 'var(--r-pill)', background: 'var(--chegara)', overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', borderRadius: 'var(--r-pill)', background: fill, transition: 'width var(--asos) var(--ease)' }} />
      </div>
    </div>
  );
}
