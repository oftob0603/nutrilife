import React from 'react';

export function DataTable({
  columns = [], rows = [], onRowClick, loading = false, skeletonRows = 10,
  empty, footer, style, ...rest
}) {
  const grid = columns.map((c) => c.width || 'minmax(0,1fr)').join(' ');
  const cell = {
    padding: 'var(--admin-cell-pad)', minWidth: 0, display: 'flex', alignItems: 'center',
    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
  };
  return (
    <div data-admin-table="" style={{
      background: 'var(--karta)', border: 'var(--hairline)', borderRadius: 'var(--r-card)',
      overflow: 'hidden', ...style,
    }} {...rest}>
      <div style={{
        display: 'grid', gridTemplateColumns: grid, borderBottom: 'var(--hairline)',
        font: 'var(--type-table-head)', color: 'var(--matn-2)',
      }}>
        {columns.map((c) => (
          <span key={c.key} style={{ ...cell, justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start' }}>{c.label}</span>
        ))}
      </div>
      {loading ? (
        Array.from({ length: skeletonRows }).map((_, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: grid, borderBottom: 'var(--hairline)' }}>
            {columns.map((c) => (
              <span key={c.key} style={cell}>
                <span style={{
                  display: 'block', height: 12, width: (40 + ((i + c.key.length) % 4) * 15) + '%',
                  borderRadius: 'var(--r-pill)', background: 'var(--skeleton)',
                }} />
              </span>
            ))}
          </div>
        ))
      ) : rows.length === 0 ? (
        <div style={{ padding: 'var(--space-12) var(--space-4)', textAlign: 'center' }}>{empty}</div>
      ) : rows.map((row, i) => (
        <div key={row.id ?? i} onClick={onRowClick ? () => onRowClick(row) : undefined}
          style={{
            display: 'grid', gridTemplateColumns: grid, borderBottom: 'var(--hairline)',
            font: 'var(--type-table-cell)', color: 'var(--siyoh)',
            cursor: onRowClick ? 'pointer' : 'default',
          }}
          onMouseEnter={(e) => { if (onRowClick) e.currentTarget.style.background = 'var(--fon)'; }}
          onMouseLeave={(e) => { if (onRowClick) e.currentTarget.style.background = 'transparent'; }}>
          {columns.map((c) => (
            <span key={c.key} style={{
              ...cell,
              justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start',
              fontVariantNumeric: c.numeric ? 'tabular-nums' : 'normal',
              color: c.muted ? 'var(--matn-2)' : undefined,
            }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.render ? c.render(row) : row[c.key]}
              </span>
            </span>
          ))}
        </div>
      ))}
      {footer && <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'var(--space-3) var(--space-4)', font: 'var(--type-caption)', color: 'var(--matn-2)',
      }}>{footer}</div>}
    </div>
  );
}
