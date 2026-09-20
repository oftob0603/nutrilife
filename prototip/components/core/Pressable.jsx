import React from 'react';

export function Pressable({
  as: Tag = 'button', scale, spring = false, disabled = false,
  children, style, onPointerDown, onPointerUp, onPointerLeave, ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const s = scale || 'var(--press-scale)';
  return (
    <Tag disabled={Tag === 'button' ? disabled : undefined}
      data-pressed={pressed ? '' : undefined}
      onPointerDown={(e) => { setPressed(true); if (onPointerDown) onPointerDown(e); }}
      onPointerUp={(e) => { setPressed(false); if (onPointerUp) onPointerUp(e); }}
      onPointerLeave={(e) => { setPressed(false); if (onPointerLeave) onPointerLeave(e); }}
      style={{
        transform: pressed && !disabled ? 'scale(' + s + ')' : 'scale(1)',
        transition: 'transform var(--tez) ' + (spring ? 'var(--ease-spring)' : 'var(--ease)'),
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }} {...rest}>{children}</Tag>
  );
}
