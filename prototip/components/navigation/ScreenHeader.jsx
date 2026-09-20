import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function ScreenHeader({ title, subtitle, onBack, action, style, ...rest }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
      padding: 'var(--space-4) var(--screen-gutter)', ...style,
    }} {...rest}>
      {onBack && (
        <button type="button" onClick={onBack} aria-label="Orqaga" style={{
          width: 'var(--hit-min)', height: 'var(--hit-min)', marginLeft: 'calc(var(--space-3) * -1)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--siyoh)',
        }}><Icon name="chevron-left" size={24} /></button>
      )}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {subtitle && <span style={{ font: 'var(--type-caption)', color: 'var(--matn-2)' }}>{subtitle}</span>}
        <h1 style={{ font: 'var(--type-screen-title)', letterSpacing: 'var(--ls-title)' }}>{title}</h1>
      </div>
      {action}
    </header>
  );
}
