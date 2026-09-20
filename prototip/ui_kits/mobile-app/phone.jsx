function Phone({ children, dark = false }) {
  return (
    <div data-theme={dark ? 'dark' : undefined} style={{
      width:390, height:844, flex:'0 0 auto', position:'relative', overflow:'hidden',
      background:'var(--fon)', color:'var(--siyoh)', borderRadius:44,
      border:'1px solid var(--chegara)', boxShadow:'0 4px 16px rgba(0,0,0,0.08)',
      display:'flex', flexDirection:'column', fontFamily:'var(--font-text)',
    }}>
      <div style={{
        height:44, flex:'0 0 auto', display:'flex', alignItems:'center',
        justifyContent:'space-between', padding:'0 28px',
        font:'var(--type-caption)', fontWeight:'var(--w-medium)', fontVariantNumeric:'tabular-nums',
      }}>
        <span>9:41</span>
        <span style={{ display:'flex', gap:6, alignItems:'center', opacity:.85 }}>
          <Icon name="signal" size={14}/><Icon name="wifi" size={14}/><Icon name="battery-full" size={16}/>
        </span>
      </div>
      <div style={{ flex:1, minHeight:0, position:'relative', display:'flex', flexDirection:'column' }}>{children}</div>
      <div style={{ height:24, flex:'0 0 auto', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ width:124, height:5, borderRadius:999, background:'var(--siyoh)', opacity:.18 }}/>
      </div>
    </div>
  );
}

function Scroll({ children, style }) {
  return <div style={{ flex:1, minHeight:0, overflowY:'auto', overflowX:'hidden', ...style }}>{children}</div>;
}

function Section({ title, action, onAction, children }) {
  return (
    <section style={{ display:'flex', flexDirection:'column', gap:'var(--title-to-content)' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:'var(--space-2)' }}>
        <h2 style={{ font:'var(--type-card-title)', fontFamily:'var(--font-text)', letterSpacing:0 }}>{title}</h2>
        {action && <button type="button" onClick={onAction} style={{
          border:0, background:'transparent', cursor:'pointer', padding:0,
          font:'var(--type-caption)', color:'var(--matn-2)',
        }}>{action}</button>}
      </div>
      {children}
    </section>
  );
}

Object.assign(window, { Phone, Scroll, Section });
