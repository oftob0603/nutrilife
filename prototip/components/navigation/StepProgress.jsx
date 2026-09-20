import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function StepProgress({ step = 1, total = 13, onBack, onSkip, skipLabel = "O'tkazib yuborish", style, ...rest }) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (step / total) * 100)) : 0;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
      padding: 'var(--space-2) var(--screen-gutter) var(--space-3)', ...style,
    }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {onBack ? (
          <button type="button" onClick={onBack} aria-label="Orqaga" style={{
            width: 'var(--hit-min)', height: 'var(--hit-min)', marginLeft: 'calc(var(--space-3) * -1)',
            border: 0, background: 'transparent', color: 'var(--siyoh)', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="chevron-left" size={24} /></button>
        ) : <span style={{ width: 'var(--space-1)' }} />}
        <span style={{
          flex: 1, font: 'var(--type-caption)', color: 'var(--matn-2)',
          fontVariantNumeric: 'tabular-nums',
        }}>{total} dan {step}</span>
        {onSkip && <button type="button" onClick={onSkip} style={{
          minHeight: 'var(--hit-min)', padding: '0 var(--space-2)', marginRight: 'calc(var(--space-2) * -1)',
          border: 0, background: 'transparent', color: 'var(--matn-2)',
          font: 'var(--type-caption)', cursor: 'pointer',
        }}>{skipLabel}</button>}
      </div>
      <div style={{ height: 4, borderRadius: 'var(--r-pill)', background: 'var(--chegara)', overflow: 'hidden' }}>
        <div style={{
          width: pct + '%', height: '100%', borderRadius: 'var(--r-pill)', background: 'var(--siyoh)',
          transition: 'width var(--asos) var(--ease)',
        }} />
      </div>
    </div>
  );
}
