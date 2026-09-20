import React from 'react';

/* Translates through the app's i18n module when present, Uzbek otherwise — so the card
   still renders standalone. Call sites pass these as bare attribute literals, invisible
   to any dictionary-key sweep, so translation happens here once for every call site. */
const tr = (s) => (typeof s === 'string' && typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s) : s);

export function BottomSheet({ open = true, onClose, title, children, style, ...rest }) {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(11,11,12,0.4)' }} />
      <section style={{
        position: 'relative', background: 'var(--karta)',
        borderRadius: 'var(--r-sheet) var(--r-sheet) 0 0',
        padding: 'var(--space-3) var(--screen-gutter) var(--space-6)',
        animation: 'nutrilife-sheet-in var(--asos) var(--ease) both', ...style,
      }} {...rest}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 'var(--space-4)' }}>
          <span style={{ width: 36, height: 4, borderRadius: 'var(--r-pill)', background: 'var(--chegara)' }} />
        </div>
        {title && <h2 style={{ font: 'var(--type-screen-title)', marginBottom: 'var(--space-4)' }}>{tr(title)}</h2>}
        {children}
      </section>
    </div>
  );
}
