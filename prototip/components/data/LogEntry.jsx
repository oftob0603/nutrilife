import React from 'react';
import { FoodImage } from './FoodImage.jsx';
import { Badge } from '../core/Badge.jsx';

/* Translates through the app's i18n module when present, and returns the Uzbek source
   otherwise — so this component still renders standalone in its design-system card. */
const trPorsiya = (s) => (typeof window !== 'undefined' && typeof window.tPorsiya === 'function' ? window.tPorsiya(s) : s);
const tr = (s) => (typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s) : s);
const tr1 = (s, ...a) => (typeof window !== 'undefined' && typeof window.t1 === 'function' ? window.t1(s, ...a) : String(s).replace(/\{(\d)\}/g, (m, i) => (a[i] != null ? a[i] : m)));

export function LogEntry({ name, portion, time, kcal, image, ai = false, onClick, style, ...rest }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div onClick={onClick}
      onPointerDown={onClick ? () => setPressed(true) : undefined}
      onPointerUp={onClick ? () => setPressed(false) : undefined}
      onPointerLeave={onClick ? () => setPressed(false) : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        background: 'var(--karta)', border: 'var(--hairline)', borderRadius: 'var(--r-card)',
        padding: 'var(--card-padding)', cursor: onClick ? 'pointer' : 'default',
        transform: pressed ? 'scale(var(--press-scale))' : 'scale(1)',
        transition: 'transform var(--tez) var(--ease)', ...style,
      }} {...rest}>
      <FoodImage src={image} size={48} alt={name} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
          <span style={{ font: 'var(--type-card-title)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
          {ai && <Badge tone="ai">{tr('AI taxmini')}</Badge>}
        </div>
        <span style={{ font: 'var(--type-caption)', color: 'var(--matn-2)', fontVariantNumeric: 'tabular-nums' }}>
          {[trPorsiya(portion), time].filter(Boolean).join(' \u00b7 ')}
        </span>
      </div>
      <span style={{ font: 'var(--type-card-title)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
        {typeof kcal === 'number' ? kcal.toLocaleString('ru-RU').replace(/\u00a0/g, ',') : kcal}
        <span style={{ font: 'var(--type-caption)', color: 'var(--matn-2)' }}>{' ' + tr('kkal')}</span>
      </span>
    </div>
  );
}
