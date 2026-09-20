/* The prototype shell. It owns nothing visual of its own — the onboarding kit, the mobile
   app kit and the paywall kit are mounted unchanged. What the shell adds is the three
   things a standalone kit cannot have: one persisted session, one set of numbers flowing
   from onboarding into the app, and PRO purchases landing back where they started. */

const SESSION = 'nutrilife.session';

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return v && v.done ? v : null;
  } catch (e) { return null; }
}

/* Onboarding answers become the app's real numbers.

   The app's screens read `GOALS` and `PROFILE` as module globals, not through props, so
   the honest way to feed them the user's own figures without rewriting twenty screens is
   to write the answers onto those objects before the app mounts. Every screen then reads
   the onboarding result on its next render: the daily ring's denominator, the macro bar
   goals, Nutrition Score's target shares, the statistics thresholds and the profile rows. */
function applyAnswers(d) {
  const plan = normaHisobi(d);
  const macros = macrosOf(plan);
  Object.assign(GOALS, {
    kcal: plan.kcal,
    p: macros.p || GOALS.p,
    fat: macros.fat || GOALS.fat,
    c: macros.c || GOALS.c,
  });
  const goalLabel = (MAQSADLAR.find((g) => g.value === d.goal) || {}).label;
  const activityLabel = (ACTIVITY.find((a) => a.value === d.activity) || {}).label;
  Object.assign(PROFILE, {
    ism: d.name || PROFILE.ism,
    kun: 1,
    maqsad: goalLabel || PROFILE.maqsad,
    maqsad_vazn: Number(d.target) || Number(d.weight) || PROFILE.maqsad_vazn,
    jins: (GENDERS.find((g) => g.value === d.gender) || {}).label || PROFILE.jins,
    yosh: Number(d.age) || PROFILE.yosh,
    boy: Number(d.height) || PROFILE.boy,
    faollik: activityLabel || PROFILE.faollik,
    afzalliklar: d.prefs && d.prefs.length ? d.prefs : PROFILE.afzalliklar,
    odatlar: (d.mealsPerDay || '3') + ' mahal' + (d.where ? ' \u00b7 ' + d.where : ''),
  });
  /* The weight log is REBASED onto the user's own measurement. Previously only WEIGHTS[0]
     was overwritten, which left the seed's later records in place: someone entering 70 kg
     got a chart that started at 70 and ended at the seed's 85, and the profile's current
     weight (the last record) showed 85 — not what they had just typed. Shifting the whole
     series by the same delta keeps the demo's trend shape while making the newest record,
     and therefore the current weight everywhere, the number the user gave. */
  if (Number(d.weight) && Array.isArray(WEIGHTS) && WEIGHTS.length) {
    const delta = Number(d.weight) - WEIGHTS[WEIGHTS.length - 1].kg;
    WEIGHTS.forEach((w, i) => { WEIGHTS[i] = { ...w, kg: Math.round((w.kg + delta) * 10) / 10 }; });
  }
  return plan;
}

function PrototypeShell() {
  const [surface,setSurface] = React.useState('mobil');
  const [session,setSession] = React.useState(readSession);
  // Applied synchronously on first render of a resumed session, before the app mounts,
  // so Home never paints the sample numbers and then correct itself.
  const [ready] = React.useState(() => {
    const s = readSession();
    if (s) applyAnswers(s.d);
    return true;
  });
  const [payFor,setPayFor] = React.useState(null);

  // The admin panel is a desktop operator surface, so it is mounted in its own frame
  // rather than into this page: both kits define module-level globals (data.jsx, screens,
  // fmt helpers) and loading them side by side would collide. The frame keeps the two
  // completely isolated, which is also why switching surfaces cannot disturb the mobile
  // session — it stays mounted behind the frame.
  const chrome = (
    <div style={{ display:'flex', gap:'var(--space-2)', alignItems:'center' }}>
      <SurfaceTab on={surface==='mobil'} onClick={()=>setSurface('mobil')}>Mobil ilova</SurfaceTab>
      <SurfaceTab on={surface==='admin'} onClick={()=>setSurface('admin')}>Admin panel</SurfaceTab>
    </div>
  );

  if (surface === 'admin') {
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)', alignItems:'center' }}>
        {chrome}
        <AdminSurface/>
        <ResetLink/>
      </div>
    );
  }

  if (!session) {
    return <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)', alignItems:'center' }}>
      {chrome}
      <OnboardingRun onDone={(d) => {
        applyAnswers(d);
        const next = { done:true, d, at:Date.now() };
        try { localStorage.setItem(SESSION, JSON.stringify(next)); } catch (e) {}
        setSession(next);
      }} onTariffs={() => setPayFor('onboarding')} pay={payFor} onClosePay={() => setPayFor(null)}/>
    </div>;
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)', alignItems:'center' }}>
      {chrome}
      <div style={{ position:'relative', width:390 }}>
        <NutriLifeApp embedded onTariffs={(id) => setPayFor(id)}/>
        {payFor && <PaywallOverlay from={payFor} onClose={() => setPayFor(null)}/>}
      </div>
      <ResetLink/>
    </div>
  );
}

/* Onboarding, driven by the kit's own screens and its own screen order. */
function OnboardingRun({ onDone, onTariffs, pay, onClosePay }) {
  const [i,setI] = React.useState(1);
  const [d,setD] = React.useState({
    terms:false, name:'', goal:'', gender:'', age:'',
    height:'', weight:'', target:'', units:'metric', activity:'', prefs:[],
    mealsPerDay:'3', where:'', motive:'',
  });
  const app = {
    d, saveError:false,
    set:(patch)=>setD(p=>({ ...p, ...patch })),
    next:(patch)=>{ setD(p=>({ ...p, ...patch })); setI(n=>n+1); },
    prev:()=>setI(n=>Math.max(1,n-1)),
    // Step 13 is the kit's Home stub; in the prototype it is the handover to the real app.
    go:(n)=>{ if (n >= 13) { onDone(d); return; } setI(n); },
    openTariffs: onTariffs,
  };
  const S = { 1:O1, 2:O3, 3:O4, 4:O5, 5:O6, 6:O7, 7:O8, 8:O9, 9:O10, 10:O11, 11:O12, 12:O13 }[i] || O1;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)', alignItems:'center' }}>
      <div style={{ position:'relative', width:390 }}>
        <Phone><S app={app}/></Phone>
        {pay && <PaywallOverlay from="onboarding" onClose={onClosePay}/>}
      </div>
      <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>
        Onboarding · {i} / 12
      </span>
    </div>
  );
}

/* The paywall, mounted over the phone it was opened from — a screen in the same session
   rather than a separate page, so the app's state is still there on return. */
function PaywallOverlay({ from, onClose }) {
  const [screen,setScreen] = React.useState('tariffs');
  const [selected,setSelected] = React.useState('yillik');
  const source =
    from === 'skan' ? 'limit' :
    from === 'retsept' ? 'recipe' :
    from === 'onboarding' ? 'onboarding' : 'profile';
  const plan = PLANS.find(p => p.id === selected) || PLANS[0];
  return (
    <div style={{
      position:'absolute', top:0, left:0, width:390, height:844, zIndex:60,
      animation:'nutrilife-paywall-in var(--asos) var(--ease) both',
    }}>
      <Phone>
        {screen === 'tariffs' ? (
          <TariffsScreen source={source} state="ready" selected={selected}
            onSelect={setSelected}
            onContinue={()=>setScreen('payment')}
            onDismiss={onClose}
            onRetry={()=>{}}/>
        ) : (
          <PaymentMethodScreen plan={plan}
            onBack={()=>setScreen('tariffs')}
            onPick={()=>{
              // A completed payment is what grants PRO. The app re-reads the status when
              // the overlay closes, so all nine features are open on return.
              writeProStatus('pro', plan.id);
              onClose();
              window.dispatchEvent(new Event('focus'));
            }}/>
        )}
      </Phone>
    </div>
  );
}

function SurfaceTab({ on, onClick, children }) {
  return (
    <button type="button" onClick={onClick} style={{
      minHeight:'var(--hit-min)', padding:'0 var(--space-4)', cursor:'pointer',
      background:on ? 'var(--siyoh)' : 'transparent',
      color:on ? 'var(--on-siyoh)' : 'var(--matn-2)',
      border:on ? '1px solid var(--siyoh)' : 'var(--hairline)',
      borderRadius:'var(--r-chip)', font:'var(--type-caption)',
    }}>{children}</button>
  );
}

/* The admin kit, at its design width, scaled down to sit next to the phone. Its own
   index.html is the entry, so the panel here is the same build that ships standalone —
   nothing is reimplemented and no recipe data is copied. */
function AdminSurface() {
  const W = 1340 + 292, H = 868;
  const scale = 0.58;
  return (
    <div style={{ width:W*scale, height:H*scale, overflow:'hidden', borderRadius:'var(--r-card)', border:'var(--hairline)', background:'var(--karta)' }}>
      <iframe src="../admin/index.html" title="NutriLife admin panel" style={{
        width:W, height:H, border:0, display:'block',
        transform:'scale(' + scale + ')', transformOrigin:'top left',
      }}/>
    </div>
  );
}

function ResetLink() {
  return (
    <button type="button" onClick={()=>{
      try { localStorage.removeItem(SESSION); localStorage.removeItem(PRO_KEY); } catch (e) {}
      location.reload();
    }} style={{
      minHeight:'var(--hit-min)', padding:'0 var(--space-4)', cursor:'pointer',
      background:'transparent', border:'var(--hairline)', borderRadius:'var(--r-chip)',
      font:'var(--type-caption)', color:'var(--matn-2)',
    }}>Prototipni qayta boshlash</button>
  );
}

Object.assign(window, { PrototypeShell, SESSION, readSession, applyAnswers, AdminSurface });
