import React from 'react';

const H = { md: 52, sm: 44 };

export function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  children,
  style,
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)',
    minHeight: H[size] || H.md, padding: size === 'sm' ? '0 var(--space-4)' : '0 var(--space-6)',
    width: full ? '100%' : 'auto',
    border: '1px solid transparent', borderRadius: 'var(--r-pill)',
    font: 'var(--type-body)', fontWeight: 'var(--w-medium)', fontFamily: 'var(--font-text)',
    cursor: disabled || loading ? 'default' : 'pointer',
    transform: pressed && !disabled && !loading ? 'scale(var(--press-scale))' : 'scale(1)',
    transition: 'transform var(--tez) var(--ease), background var(--tez) var(--ease), color var(--tez) var(--ease)',
    opacity: disabled ? 0.4 : 1, WebkitTapHighlightColor: 'transparent', textAlign: 'center',
  };
  const skin = {
    /* Primary darkens on press as well as scaling — emerald has room to darken where the
       old ink fill did not, so the press state reads on the colour and not only the
       transform (which `prefers-reduced-motion` removes). */
    primary: {
      background: pressed && !disabled && !loading ? 'var(--btn-primary-press)' : 'var(--btn-primary-bg)',
      color: 'var(--btn-primary-fg)',
    },
    accent: { background: 'var(--aksent)', color: 'var(--aksent-matn)' },
    /* PRO-tier CTA. Same geometry as primary — only the fill differs, so dimensions,
       radius, type and press behaviour all stay identical. `backgroundImage`, not
       `background`, so the pressed darkening layer composites over the gradient rather
       than replacing it. */
    pro: {
      backgroundImage: 'var(--pro-gradient)',
      /* border-box on both, because every button carries a 1px TRANSPARENT border for
         geometry. A background image defaults to padding-box, so the gradient stopped 1px
         short of the pill's edge and the transparent border ring showed through — read as
         a seam, worst at the rounded ends where the ring is widest in view. Painting to
         border-box carries the ramp right to the outline. */
      backgroundOrigin: 'border-box',
      backgroundClip: 'border-box',
      backgroundColor: 'transparent',
      color: 'var(--pro-fg)',
      boxShadow: pressed && !disabled && !loading ? 'inset 0 0 0 999px rgba(0,0,0,0.14)' : 'none',
    },
    secondary: { background: 'transparent', color: 'var(--siyoh)', borderColor: 'var(--chegara)' },
    tertiary: { background: 'transparent', color: 'var(--siyoh)', minHeight: H.sm, padding: '0 var(--space-2)' },
    danger: { background: 'transparent', color: 'var(--xato)', borderColor: 'var(--chegara)' },
  }[variant] || {};
  return (
    <button type="button" disabled={disabled || loading} onClick={onClick}
      onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
      style={{ ...base, ...skin, ...style }} {...rest}>
      {loading ? <Spin tone={variant === 'primary' ? 'var(--btn-primary-fg)' : variant === 'pro' ? 'var(--pro-fg)' : 'currentColor'} /> : icon}
      {children}
    </button>
  );
}

function Spin({ tone }) {
  return (
    <span style={{
      width: 16, height: 16, borderRadius: '50%', flex: '0 0 auto',
      border: '2px solid ' + tone, borderTopColor: 'transparent',
      animation: 'nutrilife-spin 700ms linear infinite',
    }} />
  );
}
