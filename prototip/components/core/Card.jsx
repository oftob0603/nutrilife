import React from 'react';

export function Card({ padded = true, as: Tag = 'div', onClick, children, style, ...rest }) {
  const interactive = !!onClick;
  const [pressed, setPressed] = React.useState(false);
  return (
    <Tag onClick={onClick}
      onPointerDown={interactive ? () => setPressed(true) : undefined}
      onPointerUp={interactive ? () => setPressed(false) : undefined}
      onPointerLeave={interactive ? () => setPressed(false) : undefined}
      style={{
        background: 'var(--karta)', borderRadius: 'var(--r-card)',
        padding: padded ? 'var(--card-padding)' : 0,
        border: 'var(--hairline)', boxShadow: 'var(--shadow-none)',
        cursor: interactive ? 'pointer' : 'default',
        transform: pressed ? 'scale(var(--press-scale))' : 'scale(1)',
        transition: 'transform var(--tez) var(--ease)',
        ...style,
      }} {...rest}>{children}</Tag>
  );
}
