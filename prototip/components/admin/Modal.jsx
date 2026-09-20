import React from 'react';
import { Button } from '../core/Button.jsx';
import { Icon } from '../core/Icon.jsx';

export function Modal({
  open = true, onClose, title, description, children, wide = false,
  confirmLabel, onConfirm, confirmDisabled = false, danger = false,
  cancelLabel = 'Bekor qilish', style, ...rest
}) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 40, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)',
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(11,11,12,0.4)' }} />
      <section role="dialog" aria-modal="true" style={{
        position: 'relative', width: '100%',
        maxWidth: wide ? 'var(--admin-modal-w-wide)' : 'var(--admin-modal-w)',
        maxHeight: '84vh', overflowY: 'auto',
        background: 'var(--karta)', border: 'var(--hairline)', borderRadius: 'var(--r-card)',
        padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
        animation: 'nutrilife-sheet-in var(--asos) var(--ease) both', ...style,
      }} {...rest}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {title && <h2 style={{ font: 'var(--type-screen-title)', letterSpacing: 'var(--ls-title)', margin: 0 }}>{title}</h2>}
            {description && <p style={{ font: 'var(--type-body)', color: 'var(--matn-2)', margin: 0 }}>{description}</p>}
          </div>
          {onClose && (
            <button type="button" onClick={onClose} aria-label="Yopish" style={{
              width: 'var(--hit-min)', height: 'var(--hit-min)', margin: 'calc(var(--space-3) * -1) calc(var(--space-3) * -1) 0 0',
              border: 0, background: 'transparent', color: 'var(--matn-2)', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name="x" size={20} /></button>
          )}
        </div>
        {children}
        {confirmLabel && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
            <Button variant="tertiary" onClick={onClose}>{cancelLabel}</Button>
            <Button variant="primary" disabled={confirmDisabled} onClick={onConfirm}
              style={danger ? { background: 'var(--xato)', borderColor: 'var(--xato)' } : undefined}>
              {confirmLabel}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
