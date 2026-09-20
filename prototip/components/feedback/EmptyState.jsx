import React from 'react';
import { Button } from '../core/Button.jsx';
import { Icon } from '../core/Icon.jsx';

/* Translates through the app's i18n module when present, Uzbek otherwise — so the card
   still renders standalone. Call sites pass these as bare attribute literals, invisible
   to any dictionary-key sweep, so translation happens here once for every call site. */
const tr = (s) => (typeof s === 'string' && typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s) : s);

export function EmptyState({ icon, title, body, actionLabel, onAction, secondaryLabel, onSecondary, style, ...rest }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)',
      textAlign: 'center', padding: 'var(--space-8) var(--space-4)', ...style,
    }} {...rest}>
      {icon && <Icon name={icon} size={24} color="var(--matn-3)" style={{ marginBottom: 'var(--space-2)' }} />}
      <div style={{ font: 'var(--type-card-title)' }}>{tr(title)}</div>
      {body && <div style={{ font: 'var(--type-caption)', color: 'var(--matn-2)', maxWidth: 280 }}>{tr(body)}</div>}
      {actionLabel && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)', width: '100%', maxWidth: 280 }}>
          <Button variant="primary" full onClick={onAction}>{actionLabel}</Button>
          {secondaryLabel && <Button variant="tertiary" full onClick={onSecondary}>{secondaryLabel}</Button>}
        </div>
      )}
    </div>
  );
}
