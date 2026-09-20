import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function StatTile({ label, value, caption, icon, loading = false, onClick, style, ...rest }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--karta)', border: 'var(--hairline)', borderRadius: 'var(--r-card)',
      padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
      cursor: onClick ? 'pointer' : 'default', minWidth: 0, ...style,
    }} {...rest}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', font: 'var(--type-caption)', color: 'var(--matn-2)' }}>
        {icon && <Icon name={icon} size={16} />}
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        {onClick && <Icon name="chevron-right" size={16} color="var(--matn-3)" />}
      </span>
      {loading ? (
        <span style={{ display: 'block', height: 24, width: '60%', borderRadius: 'var(--r-pill)', background: 'var(--skeleton)' }} />
      ) : (
        <span style={{ font: 'var(--type-stat)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      )}
      {caption && <span style={{ font: 'var(--type-caption)', color: 'var(--matn-2)' }}>{caption}</span>}
    </div>
  );
}
