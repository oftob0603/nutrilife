import React from 'react';

export function FoodImage({ src, alt = '', size, radius = 'var(--r-chip)', ratio = '4 / 3', style, ...rest }) {
  const box = {
    background: 'var(--chegara)', borderRadius: radius, overflow: 'hidden', flex: '0 0 auto',
    aspectRatio: size ? '1 / 1' : ratio, width: size || '100%', height: size || 'auto', ...style,
  };
  return (
    <div style={box} {...rest}>
      {src ? <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : null}
    </div>
  );
}
