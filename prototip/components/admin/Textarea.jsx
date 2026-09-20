import React from 'react';

export function Textarea({
  label, value, onChange, placeholder, rows = 4, error, hint,
  required = false, disabled = false, style, ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: 'block', minWidth: 0, ...style }}>
      {label && <span style={{
        display: 'flex', gap: 'var(--space-1)', font: 'var(--type-caption)',
        color: 'var(--matn-2)', marginBottom: 'var(--space-1)',
      }}>
        {label}{required && <span style={{ color: 'var(--xato)' }}>*</span>}
      </span>}
      <textarea value={value} rows={rows} disabled={disabled} placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{
          display: 'block', width: '100%', boxSizing: 'border-box', resize: 'vertical',
          background: 'var(--karta)', borderRadius: 'var(--r-card)',
          border: '1px solid ' + (error ? 'var(--xato)' : focus ? 'var(--siyoh)' : 'var(--chegara)'),
          padding: 'var(--space-3) var(--space-4)', outline: 'none',
          font: 'var(--type-body)', color: 'var(--siyoh)',
          opacity: disabled ? 0.4 : 1, transition: 'border-color var(--tez) var(--ease)',
        }} {...rest} />
      {error ? (
        <span style={{ display: 'block', font: 'var(--type-caption)', color: 'var(--xato)', marginTop: 'var(--space-1)' }}>{error}</span>
      ) : hint ? (
        <span style={{ display: 'block', font: 'var(--type-caption)', color: 'var(--matn-2)', marginTop: 'var(--space-1)' }}>{hint}</span>
      ) : null}
    </label>
  );
}
