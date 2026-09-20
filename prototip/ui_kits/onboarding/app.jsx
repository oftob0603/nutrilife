function OnboardingApp() {
  const [i,setI] = React.useState(1);
  const [saveError,setSaveError] = React.useState(false);
  const [d,setD] = React.useState({
    terms:false, name:'Aziz', goal:'', gender:'', age:'',
    height:'', weight:'', target:'', units:'metric', activity:'', prefs:[],
    mealsPerDay:'3', where:'', motive:'',
  });
  const app = {
    d, saveError,
    set:(patch)=>setD(p=>({ ...p, ...patch })),
    next:(patch)=>{ setD(p=>({ ...p, ...patch })); setI(n=>n+1); },
    prev:()=>setI(n=>Math.max(1,n-1)),
    go:(n)=>setI(n),
  };
  const S = { 1:O1, 2:O3, 3:O4, 4:O5, 5:O6, 6:O7, 7:O8, 8:O9, 9:O10, 10:O11, 11:O12, 12:O13, 13:HomeStub }[i] || O1;
  return (
    <div style={{ display:'flex', gap:32, alignItems:'flex-start', flexWrap:'wrap' }}>
      <Phone><S app={app}/></Phone>
      <div style={{
        width:260, flex:'0 0 auto', background:'var(--karta)', border:'var(--hairline)',
        borderRadius:'var(--r-card)', padding:'var(--card-padding)',
        display:'flex', flexDirection:'column', gap:'var(--space-3)',
      }}>
        <div style={{ font:'var(--type-card-title)' }}>Ekranlar</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'var(--space-2)' }}>
          {Array.from({length:12},(_,k)=>k+1).map(n=>(
            <Chip key={n} selected={i===n} onClick={()=>setI(n)}>{'O'+n}</Chip>
          ))}
          <Chip selected={i===13} onClick={()=>setI(13)}>E1</Chip>
        </div>
        <div style={{ height:1, background:'var(--chegara)' }}/>
        <div style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>Holatlar</div>
        <Chip selected={saveError} onClick={()=>setSaveError(v=>!v)}>Saqlash xatosi (O9)</Chip>
        <div style={{ height:1, background:'var(--chegara)' }}/>
        <div style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
          Har javob darhol saqlanadi; orqaga qaytilsa javob joyida qoladi. O7–O9 o'tkazib
          yuborilishi mumkin. O10 da orqaga tugmasi yo'q. Til tanlash olib tashlandi —
          interfeys Telegram tilidan olinadi.
        </div>
      </div>
    </div>
  );
}
