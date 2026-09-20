import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function SidebarNav({ items = [], value, onChange, brand = 'NutriLife', footer, style, ...rest }) {
  return (
    <nav style={{
      width: 'var(--admin-sidebar)', flex: '0 0 var(--admin-sidebar)', alignSelf: 'stretch',
      background: 'var(--karta)', borderRight: 'var(--hairline)',
      display: 'flex', flexDirection: 'column', gap: 'var(--space-1)',
      padding: 'var(--space-6) var(--space-3)', ...style,
    }} {...rest}>
      <span style={{
        font: 'var(--type-card-title)', fontFamily: 'var(--font-display)',
        padding: '0 var(--space-3)', marginBottom: 'var(--space-6)',
      }}>{brand}</span>
      {items.map((it) => {
        const active = it.id === value;
        return (
          <button key={it.id} type="button" onClick={() => onChange && onChange(it.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%',
              textAlign: 'left', minHeight: 'var(--hit-min)', padding: '0 var(--space-3)',
              border: 0, borderRadius: 'var(--r-chip)', cursor: 'pointer',
              background: active ? 'var(--fon)' : 'transparent',
              color: active ? 'var(--siyoh)' : 'var(--matn-2)',
              font: active ? 'var(--type-card-title)' : 'var(--type-body)',
              transition: 'background var(--tez) var(--ease)',
            }}>
            {it.icon && <Icon name={it.icon} size={18} />}
            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>
            {it.count > 0 && <span style={{
              font: 'var(--type-badge)', fontVariantNumeric: 'tabular-nums',
              background: 'var(--aksent)', color: 'var(--aksent-matn)',
              borderRadius: 'var(--r-pill)', padding: '2px var(--space-2)', minWidth: 20, textAlign: 'center',
            }}>{it.count}</span>}
          </button>
        );
      })}
      <span style={{ flex: 1 }} />
      {footer}
    </nav>
  );
}
