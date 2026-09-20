import React from 'react';

/* Lucide substitution — the brief ships no icon set. See readme ICONOGRAPHY. */
export function Icon({ name, size = 20, strokeWidth = 1.75, color = 'currentColor', style, ...rest }) {
  const host = React.useRef(null);
  React.useEffect(() => {
    let timer;
    const draw = () => {
      const el = host.current;
      if (!el || !window.lucide || !window.lucide.createIcons) return false;
      el.innerHTML = '';
      const i = document.createElement('i');
      i.setAttribute('data-lucide', name);
      el.appendChild(i);
      try {
        window.lucide.createIcons({
          nameAttr: 'data-lucide',
          attrs: { width: size, height: size, 'stroke-width': strokeWidth },
          ...(window.lucide.icons ? { icons: window.lucide.icons } : {}),
        });
      } catch (e) { /* icon set not ready */ }
      return true;
    };
    if (!draw()) timer = setInterval(() => { if (draw()) clearInterval(timer); }, 80);
    return () => clearInterval(timer);
  }, [name, size, strokeWidth]);
  return <span ref={host} aria-hidden="true" style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: size, height: size, flex: '0 0 auto', color, ...style,
  }} {...rest} />;
}
