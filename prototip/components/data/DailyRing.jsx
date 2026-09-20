import React from 'react';

/* Translates through the app's i18n module when present, and returns the Uzbek source
   otherwise — so this component still renders standalone in its design-system card. */
const tr = (s) => (typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s) : s);
const tr1 = (s, ...a) => (typeof window !== 'undefined' && typeof window.t1 === 'function' ? window.t1(s, ...a) : String(s).replace(/\{(\d)\}/g, (m, i) => (a[i] != null ? a[i] : m)));

export function DailyRing({
  value = 0, goal = 2190, size = 220, stroke = 14, unit = 'kkal',
  goalLabel, overLabel = 'Normadan oshdi', animate = true, style, ...rest
}) {
  const [shown, setShown] = React.useState(animate ? 0 : value);
  React.useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!animate || reduced) { setShown(value); return; }
    let raf, start;
    const from = shown, delta = value - from, dur = 600;
    const tick = (t) => {
      if (start === undefined) start = t;
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(from + delta * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, goal, animate]);

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = goal > 0 ? Math.min(1, shown / goal) : 0;
  const over = shown > goal;
  const fmt = (n) => Math.round(n).toLocaleString('ru-RU').replace(/\u00a0/g, ',');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', ...style }} {...rest}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ring-track)" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={over ? 'var(--ring-over)' : 'var(--ring-fill)'} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1)',
        }}>
          <span style={{
            font: 'var(--type-ring)', letterSpacing: 'var(--ls-ring)',
            fontVariantNumeric: 'tabular-nums', color: 'var(--siyoh)',
          }}>{fmt(shown)}</span>
          <span style={{
            font: 'var(--type-caption)', color: 'var(--matn-2)', fontVariantNumeric: 'tabular-nums',
          }}>{goalLabel || tr1('{0} dan', fmt(goal))}</span>
        </div>
      </div>
      <span style={{ font: 'var(--type-caption)', color: over ? 'var(--xato)' : 'var(--matn-2)', fontVariantNumeric: 'tabular-nums' }}>
        {over ? tr(overLabel) + ' \u2014 ' + fmt(shown - goal) + ' ' + tr(unit) : tr1('qoldi: {0} kkal', fmt(Math.max(0, goal - shown)))}
      </span>
    </div>
  );
}
