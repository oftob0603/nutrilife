import React from 'react';

export function Input({
  label, value, onChange, placeholder, unit, error, warning, footer, disabled = false,
  type = 'text', inputMode, numeric = false, style, ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: 'block', minWidth: 0, ...style }}>
      {label && <span style={{
        display: 'block', font: 'var(--type-caption)', color: 'var(--matn-2)',
        marginBottom: 'var(--space-1)',
      }}>{label}</span>}
      <span style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        background: 'var(--karta)', borderRadius: 'var(--r-card)',
        border: '1px solid ' + (error ? 'var(--xato)' : focus ? 'var(--siyoh)' : 'var(--chegara)'),
        padding: '0 var(--space-4)', minHeight: 'var(--hit-min)',
        opacity: disabled ? 0.4 : 1, transition: 'border-color var(--tez) var(--ease)',
      }}>
        <input type={type} value={value} disabled={disabled} placeholder={placeholder}
          inputMode={inputMode || (numeric ? 'numeric' : undefined)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          onChange={(e) => onChange && onChange(e.target.value)}
          style={{
            flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent',
            font: 'var(--type-body)', color: 'var(--siyoh)', padding: 'var(--space-3) 0',
            fontVariantNumeric: numeric ? 'tabular-nums' : 'normal',
          }} {...rest} />
        {unit && <span style={{ font: 'var(--type-caption)', color: 'var(--matn-2)', whiteSpace: 'nowrap' }}>{unit}</span>}
      </span>
      {error && <span style={{
        display: 'block', font: 'var(--type-caption)', color: 'var(--xato)',
        marginTop: 'var(--space-1)',
      }}>{error}</span>}
      {!error && warning && <span style={{
        display: 'block', font: 'var(--type-caption)', color: 'var(--matn-2)',
        marginTop: 'var(--space-1)',
      }}>{warning}</span>}
      {footer && <span style={{ display: 'block', marginTop: 'var(--space-2)' }}>{footer}</span>}
    </label>
  );
}
