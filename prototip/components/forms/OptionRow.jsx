import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* Translates through the app's i18n module when present, Uzbek otherwise — so the card
   still renders standalone. Call sites pass these as bare attribute literals, invisible
   to any dictionary-key sweep, so translation happens here once for every call site. */
const tr = (s) => (typeof s === 'string' && typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s) : s);

export function OptionRow({
  label, caption, trailing, selected = false, multi = false,
  disabled = false, onClick, style, ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <button type="button" role={multi ? 'checkbox' : 'radio'} aria-checked={selected}
      disabled={disabled} onClick={onClick}
      onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%', textAlign: 'left',
        minHeight: 'var(--hit-min)', padding: 'var(--card-padding)',
        borderRadius: 'var(--r-card)',
        background: selected ? 'var(--siyoh)' : 'var(--karta)',
        color: selected ? 'var(--on-siyoh)' : 'var(--siyoh)',
        border: '1px solid ' + (selected ? 'var(--siyoh)' : 'var(--chegara)'),
        cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.4 : 1,
        transform: pressed && !disabled ? 'scale(var(--press-scale))' : 'scale(1)',
        transition: 'transform var(--tez) var(--ease), background var(--tez) var(--ease), color var(--tez) var(--ease)',
        WebkitTapHighlightColor: 'transparent',
      }} {...rest}>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <span style={{ font: 'var(--type-card-title)' }}>{tr(label)}</span>
        {caption && <span style={{
          font: 'var(--type-caption)',
          color: selected ? 'var(--on-siyoh)' : 'var(--matn-2)',
          opacity: selected ? 0.7 : 1,
        }}>{tr(caption)}</span>}
      </span>
      {trailing}
      {selected && !trailing && <Icon name="check" size={20} />}
    </button>
  );
}
