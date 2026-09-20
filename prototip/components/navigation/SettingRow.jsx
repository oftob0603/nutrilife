import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* Translates through the app's i18n module when present, Uzbek otherwise — so the card
   still renders standalone. Call sites pass these as bare attribute literals, invisible
   to any dictionary-key sweep, so translation happens here once for every call site. */
const tr = (s) => (typeof s === 'string' && typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s) : s);

export function SettingRow({
  title, value, danger = false, saving = false, error = false,
  onClick, trailing, disabled = false, style, ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      <button type="button" disabled={disabled} onClick={onClick}
        onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%', textAlign: 'left',
          minHeight: 'var(--hit-min)', padding: 'var(--space-3) var(--space-4)',
          background: pressed && !disabled ? 'var(--karta-press)' : 'var(--karta)',
          border: 0, cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.4 : 1,
          transform: pressed && !disabled ? 'scale(var(--press-scale))' : 'scale(1)',
          transition: 'transform var(--tez) var(--ease), background var(--tez) var(--ease)',
          font: 'var(--type-body)', color: danger ? 'var(--xato)' : 'var(--siyoh)',
        }} {...rest}>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tr(title)}</span>
        {saving ? (
          <span style={{ font: 'var(--type-caption)', color: 'var(--matn-2)' }}>saqlanmoqda…</span>
        ) : value != null ? (
          <span style={{ font: 'var(--type-caption)', color: 'var(--matn-2)', whiteSpace: 'nowrap' }}>{tr(value)}</span>
        ) : null}
        {trailing !== undefined ? trailing
          : onClick && !danger ? (
            <span style={{
              display: 'inline-flex', color: 'var(--matn-3)',
              transform: pressed && !disabled ? 'translateX(2px)' : 'translateX(0)',
              transition: 'transform var(--tez) var(--ease)',
            }}><Icon name="chevron-right" size={20} /></span>
          ) : null}
      </button>
      {error && <span style={{
        font: 'var(--type-caption)', color: 'var(--xato)',
        padding: '0 var(--space-4) var(--space-2)', background: 'var(--karta)',
      }}>Saqlanmadi. Qayta urinish</span>}
    </div>
  );
}
