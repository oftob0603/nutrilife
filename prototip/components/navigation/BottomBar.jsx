import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* Labels are Uzbek, the product's default language: the first tab said 'Home' while its
   three siblings were Uzbek, so the bar read as mixed language in every language.

   `tr` translates through the app's i18n module when the app has loaded it, and returns
   the Uzbek label untouched otherwise — so this component keeps working standalone (in
   its own design-system card, with no i18n present) without importing anything. */
const DEFAULT_ITEMS = [
  { value: 'home', label: 'Asosiy', icon: 'circle-gauge' },
  { value: 'recipes', label: 'Retseptlar', icon: 'book-open' },
  { value: 'progress', label: 'Statistika', icon: 'trending-up' },
  { value: 'profile', label: 'Profil', icon: 'user' },
];

const tr = (s) => (typeof window !== 'undefined' && typeof window.t === 'function' ? window.t(s) : s);

export function BottomBar({ items, value = 'home', onChange, onAdd, addLabel = "Ovqat qo'shish", style, ...rest }) {
  const [addPressed, setAddPressed] = React.useState(false);
  const list = items || DEFAULT_ITEMS;
  const left = list.slice(0, Math.ceil(list.length / 2));
  const right = list.slice(Math.ceil(list.length / 2));
  const Tab = ({ it }) => {
    const on = it.value === value;
    return (
      <button type="button" onClick={() => onChange && onChange(it.value)} aria-current={on}
        style={{
          flex: 1, minWidth: 0, minHeight: 'var(--hit-min)', border: 0,
          /* The selected tab carries a soft tinted panel behind BOTH icon and label.
             --fon is the page tint, one step off the bar's --karta surface, so it reads
             as a recess rather than a colour — and it inverts with the theme along with
             the surface it sits on, which a fixed rgba() would not. */
          background: on ? 'var(--fon)' : 'transparent',
          borderRadius: 'var(--r-pill)',
          cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 2, color: on ? 'var(--siyoh)' : 'var(--matn-2)', padding: 'var(--space-2) 0',
          transition: 'background var(--tez) var(--ease), color var(--tez) var(--ease)',
        }}>
        <Icon name={it.icon} size={20} />
        <span style={{ font: 'var(--type-badge)', fontWeight: on ? 'var(--w-medium)' : 'var(--w-regular)' }}>{tr(it.label)}</span>
      </button>
    );
  };
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
      background: 'var(--karta)', border: 'var(--hairline)', borderRadius: 'var(--r-pill)',
      boxShadow: 'var(--shadow-float)', padding: 'var(--space-1) var(--space-3)', ...style,
    }} {...rest}>
      {left.map((it) => <Tab key={it.value} it={it} />)}
      {onAdd && (
        <button type="button" onClick={onAdd} aria-label={tr(addLabel)}
          onPointerDown={() => setAddPressed(true)}
          onPointerUp={() => setAddPressed(false)}
          onPointerLeave={() => setAddPressed(false)}
          style={{
          width: 56, height: 56, flex: '0 0 auto', borderRadius: '50%', border: 0, cursor: 'pointer',
          background: 'var(--siyoh)', color: 'var(--on-siyoh)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: addPressed ? 'var(--shadow-none)' : 'var(--shadow-float)',
          transform: addPressed ? 'scale(var(--press-scale-fab))' : 'scale(1)',
          transition: 'transform var(--asos) var(--ease-spring), box-shadow var(--tez) var(--ease)',
          WebkitTapHighlightColor: 'transparent',
        }}><Icon name="plus" size={24} /></button>
      )}
      {right.map((it) => <Tab key={it.value} it={it} />)}
    </nav>
  );
}
