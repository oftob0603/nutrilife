import React from 'react';
import { Button } from '../core/Button.jsx';

/* Translates through the app's i18n module when present, Uzbek otherwise. Every call
   site passes these as bare attribute literals, which no dictionary-key sweep can see,
   so the translation happens here — once, for all call sites. */
const tr = (s) => (typeof s === 'string' && typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s) : s);

export function ErrorState({ title, body, retryLabel = 'Qayta urinish', onRetry, altLabel, onAlt, inline = false, style, ...rest }) {
  if (inline) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)',
        borderTop: '1px solid var(--xato)', padding: 'var(--space-3) var(--space-4)',
        background: 'var(--karta)', ...style,
      }} {...rest}>
        <span style={{ font: 'var(--type-caption)', color: 'var(--xato)' }}>{tr(title)}</span>
        {onRetry && <Button variant="tertiary" size="sm" onClick={onRetry}>{tr(retryLabel)}</Button>}
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)',
      textAlign: 'center', background: 'var(--karta)', border: 'var(--hairline)',
      borderRadius: 'var(--r-card)', padding: 'var(--space-6) var(--space-4)', ...style,
    }} {...rest}>
      <div style={{ font: 'var(--type-card-title)' }}>{tr(title)}</div>
      {body && <div style={{ font: 'var(--type-caption)', color: 'var(--matn-2)', maxWidth: 300 }}>{tr(body)}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)', width: '100%', maxWidth: 280 }}>
        {onRetry && <Button variant="secondary" full onClick={onRetry}>{tr(retryLabel)}</Button>}
        {altLabel && <Button variant="tertiary" full onClick={onAlt}>{tr(altLabel)}</Button>}
      </div>
    </div>
  );
}
