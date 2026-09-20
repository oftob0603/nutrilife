import React from 'react';

export function SegmentedControl({ options = [], value, onChange, style, ...rest }) {
  return (
    <div role="tablist" style={{
      display: 'flex', gap: 'var(--space-1)', padding: 'var(--space-1)',
      background: 'var(--fon)', borderRadius: 'var(--r-chip)',
      border: 'var(--hairline)', ...style,
    }} {...rest}>
      {options.map((o) => {
        const val = typeof o === 'string' ? o : o.value;
        const label = typeof o === 'string' ? o : o.label;
        const on = val === value;
        return (
          <button key={val} type="button" role="tab" aria-selected={on} onClick={() => onChange && onChange(val)}
            style={{
              flex: 1, minHeight: 'calc(var(--hit-min) - var(--space-2))', padding: '0 var(--space-2)',
              border: 0, borderRadius: 'calc(var(--r-chip) - 4px)', cursor: 'pointer',
              background: on ? 'var(--karta)' : 'transparent',
              boxShadow: on ? 'inset 0 0 0 1px var(--chegara)' : 'none',
              color: on ? 'var(--siyoh)' : 'var(--matn-2)',
              font: 'var(--type-caption)', fontWeight: on ? 'var(--w-medium)' : 'var(--w-regular)',
              transition: 'background var(--tez) var(--ease), color var(--tez) var(--ease)',
            }}>{label}</button>
        );
      })}
    </div>
  );
}
