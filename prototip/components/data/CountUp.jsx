import React from 'react';

export function CountUp({
  value = 0, duration, from, decimals = 0, prefix = '', suffix = '',
  format, as: Tag = 'span', style, ...rest
}) {
  const [shown, setShown] = React.useState(from != null ? from : value);
  const prev = React.useRef(from != null ? from : value);
  React.useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = prev.current;
    prev.current = value;
    if (reduced || start === value) { setShown(value); return undefined; }
    const dur = duration || parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--count-duration'), 10
    ) || 700;
    let raf, t0;
    const tick = (t) => {
      if (t0 === undefined) t0 = t;
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(start + (value - start) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  const text = format ? format(decimals > 0 ? Number(shown.toFixed(decimals)) : Math.round(shown))
    : shown.toFixed(decimals);
  return <Tag style={{ fontVariantNumeric: 'tabular-nums', ...style }} {...rest}>{prefix}{text}{suffix}</Tag>;
}
