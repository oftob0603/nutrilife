import React from 'react';

export function Badge({ tone = 'ai', children, onClick, style, ...rest }) {
  const skin = {
    ai: { background: 'var(--badge-ai-bg)', color: 'var(--badge-ai-fg)' },
    /* PRO tier — the same gradient as `Button variant="pro"`, so a PRO mark reads the
       same whether it is a badge or a CTA. A separate tone rather than a change to `ai`:
       the admin panel marks a user's PRO role with `tone="ai"` too, and that table is
       explicitly out of scope. NO border — the base pill has none, so adding one would
       make this tone 2px larger than the `ai` badge beside it. */
    pro: {
      backgroundImage: 'var(--pro-gradient)', backgroundColor: 'transparent',
      color: 'var(--pro-fg)',
    },
    neutral: { background: 'var(--fon)', color: 'var(--matn-2)', border: 'var(--hairline)' },
    error: { background: 'transparent', color: 'var(--xato)', border: '1px solid var(--xato)' },
  }[tone] || {};
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)',
      padding: '3px var(--space-2)', borderRadius: 'var(--r-pill)',
      font: 'var(--type-badge)', whiteSpace: 'nowrap',
      ...(onClick ? { border: 0, cursor: 'pointer', fontFamily: 'inherit' } : null),
      ...skin, ...style,
    }} {...rest}>{children}</Tag>
  );
}
