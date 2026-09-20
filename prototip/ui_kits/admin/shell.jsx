// Page chrome: left rail + scrolling content column with a sticky title row.
const ADMIN_THEME = 'nutrilife.admin.theme';

/* One create-option dialog for every admin-managed list. The store owns the rules, so
   empty and duplicate are refused identically wherever the dialog is opened from, and the
   accepted value is handed back so the caller can select it in the form it came from. */
function RoyxatDialog({ open, onClose, onAdded, list, title, description, label = 'Nomi' }) {
  const [nom,setNom] = React.useState('');
  const [xato,setXato] = React.useState(null);
  React.useEffect(()=>{ if (open) { setNom(''); setXato(null); } }, [open]);
  if (!open) return null;
  const save = () => {
    const t = nom.trim();
    const err = royxatQoshish(list, t);
    if (err) { setXato(err); return; }
    if (onAdded) onAdded(t);
    onClose();
  };
  return (
    <Modal open onClose={onClose} title={title} description={description}
      confirmLabel="Qo'shish" confirmDisabled={!nom.trim()} onConfirm={save}>
      <Input label={label} value={nom} error={xato || undefined}
        onChange={(v)=>{ setNom(v); setXato(null); }}/>
    </Modal>
  );
}

/* The whole panel is one themed subtree: data-theme sits on the outermost element, so
   every token the sidebar, cards, charts, inputs and buttons read flips with it — nothing
   needs a dark-mode branch of its own. */
function Shell({ section, onSection, children }) {
  const [theme,setTheme] = React.useState(() => {
    try { return localStorage.getItem(ADMIN_THEME) === 'dark' ? 'dark' : 'light'; } catch (e) { return 'light'; }
  });
  const flip = () => setTheme(t => {
    const next = t === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(ADMIN_THEME, next); } catch (e) {}
    return next;
  });
  return (
    <div data-theme={theme === 'dark' ? 'dark' : undefined} data-admin-shell="" style={{
      display:'flex', width:'100%', minWidth:'var(--admin-min)', height:820,
      background:'var(--fon)', border:'var(--hairline)', borderRadius:'var(--r-card)', overflow:'hidden',
    }}>
      <SidebarNav items={SECTIONS} value={section} onChange={onSection}
        footer={<div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', padding:'0 var(--space-3)' }}>
          <button type="button" onClick={flip}
            title={theme === 'dark' ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
            aria-label={theme === 'dark' ? "Yorug' rejim" : "Qorong'i rejim"}
            style={{
              width:'var(--hit-min)', height:'var(--hit-min)', display:'grid', placeItems:'center',
              background:'transparent', border:'var(--hairline)', borderRadius:'var(--r-chip)',
              color:'var(--matn-2)', cursor:'pointer', flex:'0 0 auto',
            }}>
            <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={18}/>
          </button>
          <span style={{ font:'var(--type-caption)', color:'var(--matn-3)', flex:1, minWidth:0 }}>
            admin · Telegram
          </span>
        </div>}/>
      <div style={{ flex:1, minWidth:0, overflowY:'auto' }}>{children}</div>
    </div>
  );
}

function Page({ title, caption, actions, children }) {
  return (
    <div style={{ padding:'var(--admin-gutter)', display:'flex', flexDirection:'column', gap:'var(--space-6)', maxWidth:'var(--admin-content-max)' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:'var(--space-4)' }}>
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:'var(--space-1)' }}>
          <h1 style={{ font:'var(--type-screen-title)', letterSpacing:'var(--ls-title)', margin:0 }}>{title}</h1>
          {caption && <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{caption}</span>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

function Toolbar({ children }) {
  return <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', flexWrap:'wrap' }}>{children}</div>;
}

function Field({ label, children, span }) {
  return (
    <label style={{ display:'flex', flexDirection:'column', gap:'var(--space-1)', minWidth:0, gridColumn: span ? 'span ' + span : undefined }}>
      <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{label}</span>
      <span style={{ font:'var(--type-body)' }}>{children}</span>
    </label>
  );
}

Object.assign(window, { Shell, Page, Toolbar, Field, RoyxatDialog, ADMIN_THEME });
