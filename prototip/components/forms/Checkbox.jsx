import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Checkbox({ checked = false, onChange, children, error, boxFill = 'transparent', disabled = false, style, ...rest }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', ...style }}>
      <button type="button" role="checkbox" aria-checked={checked} disabled={disabled}
        onClick={() => onChange && onChange(!checked)}
        onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
        style={{
          display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', width: '100%', textAlign: 'left',
          minHeight: 'var(--hit-min)', padding: 'var(--space-2) 0', border: 0, background: 'transparent',
          cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.4 : 1,
          transform: pressed && !disabled ? 'scale(var(--press-scale))' : 'scale(1)',
          transition: 'transform var(--tez) var(--ease)', WebkitTapHighlightColor: 'transparent',
        }} {...rest}>
        <span style={{
          width: 24, height: 24, flex: '0 0 auto', marginTop: 2,
          borderRadius: 'var(--r-chip)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: checked ? 'var(--siyoh)' : boxFill,
          color: checked ? 'var(--on-siyoh)' : 'transparent',
          border: '1px solid ' + (error ? 'var(--xato)' : checked ? 'var(--siyoh)' : 'var(--chegara)'),
          transition: 'background var(--tez) var(--ease)',
        }}>{checked && <Icon name="check" size={16} />}</span>
        <span style={{ flex: 1, minWidth: 0, font: 'var(--type-body)', color: 'var(--siyoh)' }}>{children}</span>
      </button>
      {error && <span style={{ font: 'var(--type-caption)', color: 'var(--xato)' }}>{error}</span>}
    </div>
  );
}
