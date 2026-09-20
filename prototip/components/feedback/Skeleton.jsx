import React from 'react';

export function Skeleton({ width = '100%', height = 16, radius = 'var(--r-chip)', circle = false, style, ...rest }) {
  return (
    <div aria-hidden="true" style={{
      width: circle ? height : width, height,
      borderRadius: circle ? '50%' : radius,
      background: 'var(--skeleton)', flex: '0 0 auto',
      animation: 'nutrilife-pulse 1.5s var(--ease) infinite', ...style,
    }} {...rest} />
  );
}
