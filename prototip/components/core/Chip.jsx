import React from 'react';

export function Chip({ selected = false, disabled = false, pro = false, onClick, children, style, ...rest }) {
  /* `pro` paints the tier gradient regardless of selection — a PRO-gated filter is
     marked by what it costs, not by whether it is active. */
  const proSkin = pro ? {
    backgroundImage: 'var(--pro-gradient)', backgroundColor: 'transparent',
    backgroundOrigin: 'border-box', backgroundClip: 'border-box',
    border: '1px solid transparent', color: 'var(--pro-fg)',
  } : null;
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      style={{
        minHeight: 'var(--hit-min)', padding: '0 var(--space-4)',
        borderRadius: 'var(--r-chip)', cursor: disabled ? 'default' : 'pointer',
        background: selected ? 'var(--siyoh)' : 'var(--karta)',
        color: selected ? 'var(--on-siyoh)' : 'var(--siyoh)',
        border: selected ? '1px solid var(--siyoh)' : 'var(--hairline)',
        font: 'var(--type-body)', fontWeight: 'var(--w-medium)',
        fontVariantNumeric: 'tabular-nums', opacity: disabled ? 0.4 : 1,
        transition: 'background var(--tez) var(--ease), color var(--tez) var(--ease)',
        ...proSkin, ...style,
      }} {...rest}>{children}</button>
  );
}
