import React from 'react';

/* Translates through the app's i18n module when present, Uzbek otherwise — so the
   component still renders standalone in its design-system card. */
const tr = (s) => (typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s) : s);
const tr1 = (s, ...a) => (typeof window !== 'undefined' && typeof window.t1 === 'function' ? window.t1(s, ...a) : String(s).replace(/\{(\d)\}/g, (m, i) => (a[i] != null ? a[i] : m)));

const DAY = 86400000;
const dayNum = (iso) => Math.round(new Date(iso + 'T00:00:00').getTime() / DAY);
const ddmm = (iso) => iso.slice(8, 10) + '.' + iso.slice(5, 7);

/* Points are recorded measurements only — never interpolated, never padded to today.

   x is a DATE position, not an array index, so a 10-day gap reads as two and a half times
   the width of a 4-day one instead of being flattened to equal steps. Every recorded
   measurement connects to the next one regardless of how long the gap was: the line
   asserts nothing about the days in between, only that these two readings happened.

   The domain ends at the LAST RECORD, so nothing is drawn into the future.

   The y scale picks a round STEP first, then derives the domain from it — the reverse of
   snapping min/max to a multiple and dividing by four, which produces gridlines on 83.75
   and 91.25 while their labels read 84 and 91: a point measured against a labelled line
   then gives the wrong weight, and the ladder shows uneven gaps (80→84→88→91→95). Choosing
   the step from {1, 2, 2.5, 5, 10} also stops the domain over-reaching the data — padding
   ±2 and snapping to 5 turned an 82–88 series into an 80–95 domain, flattening the line
   into 43% of the plot. */
export function WeightChart({
  points = [], goal, height = 180, emptyLabel = 'Ikkinchi o\'lchovdan keyin grafik chiziladi',
  onPointClick, animate = true, style, ...rest
}) {
  const [active, setActive] = React.useState(null);
  const pathRef = React.useRef(null);
  const [len, setLen] = React.useState(0);
  const gid = React.useMemo(() => 'wc' + Math.random().toString(36).slice(2, 8), []);

  const sorted = React.useMemo(
    () => points.filter((p) => p && p.iso != null && p.kg != null).slice()
      .sort((a, b) => dayNum(a.iso) - dayNum(b.iso)),
    [points],
  );

  React.useEffect(() => {
    if (pathRef.current && pathRef.current.getTotalLength) setLen(pathRef.current.getTotalLength());
  }, [sorted]);

  if (sorted.length < 2) {
    return (
      <div style={{
        height, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--r-card)', border: '1px dashed var(--chegara)',
        font: 'var(--type-caption)', color: 'var(--matn-2)', textAlign: 'center',
        padding: 'var(--space-4)', ...style,
      }} {...rest}>{emptyLabel}</div>
    );
  }

  const vals = sorted.map((p) => p.kg).concat(goal != null ? [goal] : []);
  /* Round step first, domain second. STEPS are the values a reader accepts on a weight
     axis; the smallest one that covers the data in four intervals wins, so the series
     fills the plot instead of floating inside a domain padded out to the next multiple. */
  const rawLo = Math.min(...vals), rawHi = Math.max(...vals);
  const need = (rawHi - rawLo) || 1;
  const STEPS = [0.5, 1, 2, 2.5, 5, 10, 20];
  const step = STEPS.find((s) => s * 4 >= need) || Math.ceil(need / 4);
  let lo = Math.floor(rawLo / step) * step;
  // A reading exactly on the floor sits on the axis; drop one step so it has room.
  if (rawLo - lo < step * 0.15) lo -= step;
  if (lo + step * 4 < rawHi) lo = Math.ceil((rawHi - step * 4) / step) * step;
  const hi = lo + step * 4;
  const span = hi - lo;
  const ticks = [0, 1, 2, 3, 4].map((i) => lo + step * i);
  // Labels print the tick's EXACT value: rounding is what let 87.5 be labelled 88.
  const tickLabel = (v) => (Math.abs(v - Math.round(v)) < 0.01 ? String(Math.round(v)) : v.toFixed(1));

  const d0 = dayNum(sorted[0].iso);
  const dayspan = dayNum(sorted[sorted.length - 1].iso) - d0 || 1;
  const x = (p) => ((dayNum(p.iso) - d0) / dayspan) * 100;
  const y = (kg) => 100 - ((kg - lo) / span) * 100;
  const line = sorted.map((p, i) => (i ? 'L' : 'M') + x(p).toFixed(2) + ' ' + y(p.kg).toFixed(2)).join(' ');
  const area = line + ' L100 100 L0 100 Z';
  const last = sorted[sorted.length - 1];
  const cur = active != null ? sorted.find((p) => p.id === active) : null;
  const total = Math.max(1, sorted.length - 1);
  const shownPoint = cur || last;

  // Four date labels across the range, by DATE rather than by index, so they line up with
  // the gridlines above them.
  const xLabels = [0, 1, 2, 3].map((i) => {
    const iso = new Date((d0 + (dayspan * i) / 3) * DAY).toISOString().slice(0, 10);
    return { iso, pct: (i / 3) * 100 };
  });

  return (
    <div style={{ position: 'relative', paddingLeft: 30, ...style }} {...rest}>
      <div style={{ position: 'relative', height }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none"
          style={{ width: '100%', height, display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--aksent)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--aksent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((v) => (
            <line key={v} x1="0" y1={y(v)} x2="100" y2={y(v)}
              stroke="var(--chegara)" strokeWidth="1" strokeDasharray="2 4"
              vectorEffect="non-scaling-stroke" />
          ))}
          {xLabels.map((l) => (
            <line key={l.pct} x1={l.pct} y1="0" x2={l.pct} y2="100"
              stroke="var(--chegara)" strokeWidth="1" strokeDasharray="2 4"
              vectorEffect="non-scaling-stroke" />
          ))}
          <path d={area} fill={'url(#' + gid + ')'} stroke="none" />
          {goal != null && (
            <line x1="0" y1={y(goal)} x2="100" y2={y(goal)}
              stroke="var(--matn-3)" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
          )}
          <path ref={pathRef} d={line} fill="none" stroke="var(--aksent)" strokeWidth="2.5"
            strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"
            style={animate
              ? (len ? {
                  strokeDasharray: len, strokeDashoffset: 0,
                  animation: 'nutrilife-draw var(--chart-draw-duration) var(--ease) both',
                  ['--draw-length']: len,
                } : { visibility: 'hidden' })
              : undefined} />
          {sorted.map((p, i) => (
            <circle key={p.id != null ? p.id : i} cx={x(p)} cy={y(p.kg)} r="3.4" vectorEffect="non-scaling-stroke"
              fill={active === p.id ? 'var(--aksent)' : 'var(--karta)'}
              stroke="var(--aksent)" strokeWidth="2"
              style={animate ? {
                cursor: 'pointer', transformOrigin: 'center', transformBox: 'fill-box',
                animation: 'nutrilife-pop var(--tez) var(--ease) both',
                animationDelay: 'calc(var(--chart-draw-duration) * ' + (i / total).toFixed(3) + ')',
              } : { cursor: 'pointer' }}
              onClick={() => { setActive(active === p.id ? null : p.id); if (onPointClick) onPointClick(p, i); }} />
          ))}
        </svg>

        {/* y-axis labels, in the 30px gutter this container reserves */}
        {ticks.map((v) => (
          <span key={v} style={{
            position: 'absolute', right: '100%', marginRight: 6,
            top: (y(v) / 100) * height, transform: 'translateY(-50%)',
            font: 'var(--type-badge)', color: 'var(--matn-3)',
            fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
          }}>{tickLabel(v)}</span>
        ))}

        {/* The newest reading is called out by default; tapping any point moves the callout
            there, so the chart answers "what am I now" without interaction.

            The position is CLAMPED and flips below the point when there is no room above:
            the y domain snaps outward to a 5 kg step, so a called-out series maximum can
            sit high enough in the plot that a fixed -34px offset pushes the pill off the
            SVG and onto the range control above it. Reachable in normal use, since the
            callout defaults to the last point and a new high weight becomes that point. */}
        {(() => {
          const py = (y(shownPoint.kg) / 100) * height;
          const above = py - 34;
          const flip = above < 0;
          return (
            <span style={{
              position: 'absolute', left: x(shownPoint) + '%',
              top: flip ? Math.min(height - 22, py + 12) : above,
              transform: 'translateX(-50%)', padding: '3px 8px',
              background: 'var(--aksent)', color: 'var(--aksent-matn)',
              borderRadius: 'var(--r-chip)', font: 'var(--type-badge)', fontWeight: 600,
              fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', pointerEvents: 'none',
            }}>{tr1('{0} kg', shownPoint.kg)}</span>
          );
        })()}
      </div>

      <div style={{ position: 'relative', height: 18, marginTop: 6 }}>
        {xLabels.map((l) => (
          <span key={l.pct} style={{
            position: 'absolute', left: l.pct + '%',
            transform: l.pct === 0 ? 'none' : l.pct === 100 ? 'translateX(-100%)' : 'translateX(-50%)',
            font: 'var(--type-badge)', color: 'var(--matn-3)',
            fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
          }}>{ddmm(l.iso)}</span>
        ))}
      </div>

      {/* The goal line is drawn but NOT labelled in-plot: the summary strip beneath the
          chart states the goal and the remainder, and a second label on the dash made the
          same number appear twice in one card. */}
      {cur && cur.sana && (
        <span style={{
          position: 'absolute', left: 30, right: 0, bottom: 'calc(var(--space-4) * -1)',
          textAlign: 'center', font: 'var(--type-caption)', color: 'var(--matn-2)',
          fontVariantNumeric: 'tabular-nums',
        }}>{cur.sana}</span>
      )}
    </div>
  );
}
