import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* Translates through the app's i18n module when present, Uzbek otherwise — so the card
   still renders standalone. Call sites pass these as bare attribute literals, invisible
   to any dictionary-key sweep, so translation happens here once for every call site. */
const tr = (s) => (typeof s === 'string' && typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s) : s);

export function ActionRow({ icon, title, caption, disabled = false, onClick, trailing, style, ...rest }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%', textAlign: 'left',
        minHeight: 'var(--hit-min)', padding: 'var(--card-padding)',
        background: 'var(--karta)', border: 'var(--hairline)', borderRadius: 'var(--r-card)',
        cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.4 : 1,
        transform: pressed && !disabled ? 'scale(var(--press-scale))' : 'scale(1)',
        transition: 'transform var(--tez) var(--ease)', ...style,
      }} {...rest}>
      {icon && <Icon name={icon} size={24} />}
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <span style={{ font: 'var(--type-card-title)' }}>{tr(title)}</span>
        {caption && <span style={{ font: 'var(--type-caption)', color: 'var(--matn-2)' }}>{tr(caption)}</span>}
      </span>
      {trailing || <Icon name="chevron-right" size={20} color="var(--matn-3)" />}
    </button>
  );
}
