import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* A listbox, not a native <select>.

   The native control paints its option list with the OS theme: on a dark panel the popup
   came back white with near-white text, unreadable, and no amount of CSS on the <select>
   reaches inside it. So the options are ordinary elements here, drawing from the same
   tokens as the rest of the panel — which is also what lets the list carry an action row
   ("+ Yangi qo'shish") that a native option list cannot.

   The open list is rendered through a PORTAL to <body>, positioned with fixed coordinates
   measured from the trigger's rect. Two ancestors defeat the simpler approaches: the
   panel's content column has overflow:auto (so an absolute popup is clipped), and Card
   carries transform:scale(1) at rest, which makes it a containing block for fixed
   descendants (so plain position:fixed would resolve against the card and land ~300px
   off, still inside the clipper). Only a portal escapes both, and stays correct if some
   future ancestor gains a transform.

   A portal leaves the themed subtree, so the theme attribute is copied from the trigger's
   nearest [data-theme] ancestor onto the popup — otherwise the list would read :root
   tokens and paint light while the panel is dark.

   Keyboard: Enter/Space/ArrowDown opens, arrows move, Enter picks, Escape closes. */
export function Select({
  label, value, onChange, options = [], error, disabled = false,
  createLabel, onCreate, placeholder = 'Tanlang', style, ...rest
}) {
  const [open, setOpen] = React.useState(false);
  const [cursor, setCursor] = React.useState(-1);
  const [rect, setRect] = React.useState(null);
  const [theme, setTheme] = React.useState(null);
  const box = React.useRef(null);
  const trigger = React.useRef(null);
  const pop = React.useRef(null);
  const norm = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const current = norm.find((o) => o.value === value);
  const canCreate = !!(createLabel && onCreate);
  const rows = canCreate ? norm.length + 1 : norm.length;
  const MAXH = 260;

  const measure = React.useCallback(() => {
    if (!trigger.current) return;
    const r = trigger.current.getBoundingClientRect();
    const below = window.innerHeight - r.bottom - 8;
    const above = r.top - 8;
    // Flip up only when below genuinely cannot hold the list and above can hold more.
    const up = below < Math.min(MAXH, rows * 44 + 16) && above > below;
    /* No horizontal clamping: the popup is exactly the trigger's width, so if the trigger
       is visible the popup is too, and clamping to the viewport pulled the list sideways
       on pages wider than the viewport (the admin panel is 1632px). Alignment with the
       trigger always wins — a detached list is worse than one that follows a wide page. */
    setRect({ left: r.left, width: r.width, top: r.bottom + 4, bottom: window.innerHeight - r.top + 4, up, space: Math.max(120, (up ? above : below)) });
    const host = trigger.current.closest('[data-theme]');
    setTheme(host ? host.getAttribute('data-theme') : null);
  }, [rows]);

  React.useEffect(() => {
    if (!open) return;
    measure();
    const away = (e) => {
      if (box.current && box.current.contains(e.target)) return;
      if (pop.current && pop.current.contains(e.target)) return;
      setOpen(false);
    };
    const reflow = () => measure();
    document.addEventListener('mousedown', away);
    window.addEventListener('resize', reflow);
    // Capture phase: the panel scrolls in an inner column, not the window.
    window.addEventListener('scroll', reflow, true);
    return () => {
      document.removeEventListener('mousedown', away);
      window.removeEventListener('resize', reflow);
      window.removeEventListener('scroll', reflow, true);
    };
  }, [open, measure]);

  React.useEffect(() => {
    if (open) setCursor(norm.findIndex((o) => o.value === value));
  }, [open]);

  const pick = (v) => { setOpen(false); if (onChange) onChange(v); };

  const onKey = (e) => {
    if (disabled) return;
    if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) { e.preventDefault(); setOpen(true); return; }
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => (c + 1) % rows); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => (c - 1 + rows) % rows); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (canCreate && cursor === norm.length) { setOpen(false); onCreate(); return; }
      if (norm[cursor]) pick(norm[cursor].value);
    }
  };

  const rowStyle = (bg, color, font) => ({
    display: 'flex', alignItems: 'center', gap: 'var(--space-2)', width: '100%',
    textAlign: 'left', minHeight: 'var(--hit-min)', padding: '0 var(--space-3)',
    border: 0, borderRadius: 'var(--r-chip)', cursor: 'pointer', background: bg, color, font,
  });

  /* Portal to <body>. Taken from the global rather than imported: this file ships in the
     component bundle, which only imports React — and every page that mounts the panel
     already has ReactDOM loaded. If it were ever absent the list still renders in place,
     which is clipped but never invisible. */
  const portal = (node) => {
    const RD = typeof ReactDOM !== 'undefined' ? ReactDOM : (typeof window !== 'undefined' ? window.ReactDOM : null);
    return RD && RD.createPortal ? RD.createPortal(node, document.body) : node;
  };

  return (
    <div style={{ display: 'block', minWidth: 0, ...style }} ref={box}>
      {label && <span style={{
        display: 'block', font: 'var(--type-caption)', color: 'var(--matn-2)', marginBottom: 'var(--space-1)',
      }}>{label}</span>}
      <button ref={trigger} type="button" disabled={disabled} onKeyDown={onKey}
        onClick={() => !disabled && setOpen((v) => !v)}
        aria-haspopup="listbox" aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)', width: '100%',
          textAlign: 'left', background: 'var(--karta)', borderRadius: 'var(--r-card)',
          border: '1px solid ' + (error ? 'var(--xato)' : open ? 'var(--siyoh)' : 'var(--chegara)'),
          padding: 'var(--space-3) var(--space-4)', minHeight: 'var(--hit-min)',
          font: 'var(--type-body)', color: current ? 'var(--siyoh)' : 'var(--matn-3)',
          opacity: disabled ? 0.4 : 1, cursor: disabled ? 'default' : 'pointer',
          transition: 'border-color var(--tez) var(--ease)',
        }} {...rest}>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {current ? current.label : placeholder}
        </span>
        <Icon name="chevron-down" size={18} color="var(--matn-2)" />
      </button>
      {open && rect && portal(
        <div ref={pop} data-theme={theme || undefined} role="listbox" style={{
          position: 'fixed', left: rect.left, width: rect.width, zIndex: 50,
          top: rect.up ? 'auto' : rect.top, bottom: rect.up ? rect.bottom : 'auto',
          background: 'var(--karta)', border: 'var(--hairline)', borderRadius: 'var(--r-card)',
          boxShadow: 'var(--shadow-float)', padding: 'var(--space-1)',
          maxHeight: Math.min(MAXH, rect.space), overflowY: 'auto',
        }}>
          {norm.map((o, i) => {
            const on = o.value === value;
            return (
              <button key={o.value} type="button" role="option" aria-selected={on}
                onMouseEnter={() => setCursor(i)} onClick={() => pick(o.value)}
                style={rowStyle(
                  /* Selected reads as the same surface as hover, marked by the check and
                     the heavier label — not by a colour change. The accent tint used for
                     selected plan CARDS is too loud inside a list: it made one row jump to
                     a green block while its neighbours stayed dark. */
                  on || i === cursor ? 'var(--karta-press)' : 'transparent',
                  'var(--siyoh)',
                  on ? 'var(--type-card-title)' : 'var(--type-body)',
                )}>
                <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.label}</span>
                {on && <Icon name="check" size={16} color="var(--siyoh)" />}
              </button>
            );
          })}
          {canCreate && (
            <React.Fragment>
              <span style={{ display: 'block', height: 1, background: 'var(--chegara)', margin: 'var(--space-1) 0' }} />
              <button type="button" onMouseEnter={() => setCursor(norm.length)}
                onClick={() => { setOpen(false); onCreate(); }}
                style={rowStyle(
                  cursor === norm.length ? 'var(--karta-press)' : 'transparent',
                  'var(--matn-2)', 'var(--type-body)',
                )}>
                <Icon name="plus" size={16} color="var(--matn-2)" />
                <span style={{ flex: 1, minWidth: 0 }}>{createLabel}</span>
              </button>
            </React.Fragment>
          )}
        </div>
      )}
      {error && <span style={{
        display: 'block', font: 'var(--type-caption)', color: 'var(--xato)', marginTop: 'var(--space-1)',
      }}>{error}</span>}
    </div>
  );
}
