import React from 'react';
import { Badge } from '../core/Badge.jsx';
import { Button } from '../core/Button.jsx';
import { Icon } from '../core/Icon.jsx';

/* Translates through the app's i18n module when present, Uzbek otherwise — so the card
   still renders standalone. Applied to `title`, `caption` and `cta` inside the component
   because every call site passes a bare Uzbek literal in an attribute, which no
   dictionary-key sweep can see. Doing it here covers all present and future call sites. */
const tr = (s) => (typeof s === 'string' && typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s) : s);

export function ProLock({
  title, caption, cta = 'PRO ni ochish', onUnlock, compact = false, style, ...rest
}) {
  if (compact) {
    return (
      <button type="button" onClick={onUnlock} style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%', textAlign: 'left',
        minHeight: 'var(--hit-min)', padding: 'var(--card-padding)',
        background: 'var(--karta)', border: '1px solid var(--chegara)',
        borderRadius: 'var(--r-card)', cursor: 'pointer', ...style,
      }} {...rest}>
        <Icon name="lock" size={18} color="var(--matn-3)" />
        <span style={{ flex: 1, minWidth: 0, font: 'var(--type-caption)', color: 'var(--matn-2)' }}>{tr(title)}</span>
        <Badge tone="pro">PRO</Badge>
      </button>
    );
  }
  return (
    <div onClick={onUnlock} style={{
      display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'flex-start',
      background: 'var(--karta)', border: '1px solid var(--chegara)',
      borderRadius: 'var(--r-card)', padding: 'var(--card-padding)',
      cursor: onUnlock ? 'pointer' : 'default', ...style,
    }} {...rest}>
      <Badge tone="pro">PRO</Badge>
      <span style={{ font: 'var(--type-card-title)' }}>{tr(title)}</span>
      {caption && <span style={{ font: 'var(--type-caption)', color: 'var(--matn-2)' }}>{tr(caption)}</span>}
      {onUnlock && <Button variant="pro" full onClick={onUnlock}>{tr(cta)}</Button>}
    </div>
  );
}
