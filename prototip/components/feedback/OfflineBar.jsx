import React from 'react';

export function OfflineBar({ children = "Internet yo'q — oxirgi ma'lumot ko'rsatilmoqda", style, ...rest }) {
  return (
    <div role="status" style={{
      padding: 'var(--space-2) var(--space-4)', background: 'var(--siyoh)',
      color: 'var(--on-siyoh)', font: 'var(--type-caption)', textAlign: 'center', ...style,
    }} {...rest}>{children}</div>
  );
}
