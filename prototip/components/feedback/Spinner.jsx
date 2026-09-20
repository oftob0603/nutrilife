import React from 'react';

export function Spinner({ size = 20, thickness = 2, color = 'currentColor', style, ...rest }) {
  return (
    <span aria-hidden="true" style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%',
      border: thickness + 'px solid ' + color, borderTopColor: 'transparent',
      animation: 'nutrilife-spin 700ms linear infinite', ...style,
    }} {...rest} />
  );
}
