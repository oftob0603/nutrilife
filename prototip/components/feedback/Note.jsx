import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Note({ tone = 'info', title, children, collapsible = false, defaultOpen = false, style, ...rest }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const warn = tone === 'warn';
  const body = (
    <span style={{ font: 'var(--type-caption)', color: warn ? 'var(--siyoh)' : 'var(--matn-2)' }}>{children}</span>
  );
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
      background: 'var(--karta)', borderRadius: 'var(--r-card)', padding: 'var(--card-padding)',
      border: '1px solid ' + (warn ? 'var(--xato)' : 'var(--chegara)'), ...style,
    }} {...rest}>
      {collapsible ? (
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)', width: '100%', textAlign: 'left',
          minHeight: 'var(--hit-min)', margin: 'calc(var(--space-2) * -1) 0', padding: 0,
          border: 0, background: 'transparent', color: 'var(--siyoh)',
          font: 'var(--type-card-title)', cursor: 'pointer',
        }}>
          <span style={{ flex: 1, minWidth: 0 }}>{title}</span>
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} color="var(--matn-3)" />
        </button>
      ) : title && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', font: 'var(--type-card-title)' }}>
          {warn && <Icon name="triangle-alert" size={20} color="var(--xato)" />}
          <span style={{ flex: 1, minWidth: 0 }}>{title}</span>
        </span>
      )}
      {(!collapsible || open) && body}
    </div>
  );
}
