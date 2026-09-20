import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function SearchField({ value, onChange, placeholder = "Osh, manti, somsa…", onClear, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
      background: 'var(--karta)', borderRadius: 'var(--r-card)',
      border: '1px solid ' + (focus ? 'var(--siyoh)' : 'var(--chegara)'),
      padding: '0 var(--space-4)', minHeight: 'var(--hit-min)',
      transition: 'border-color var(--tez) var(--ease)', ...style,
    }} {...rest}>
      <Icon name="search" size={20} color="var(--matn-2)" />
      <input value={value} placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{
          flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent',
          font: 'var(--type-body)', color: 'var(--siyoh)', padding: 'var(--space-3) 0',
        }} />
      {value ? (
        <button type="button" onClick={onClear} aria-label="Tozalash" style={{
          border: 0, background: 'transparent', cursor: 'pointer', padding: 'var(--space-1)',
          display: 'inline-flex', color: 'var(--matn-2)',
        }}><Icon name="x" size={18} /></button>
      ) : null}
    </div>
  );
}
