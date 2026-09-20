// O11–O13
const O11_LINES = ['Javoblaringiz yig\'ilmoqda','Kunlik norma hisoblanmoqda','Makrolar taqsimlanmoqda'];

function O11({ app }) {
  const [i,setI] = React.useState(0);
  React.useEffect(()=>{
    const t = setInterval(()=>setI(p=>Math.min(O11_LINES.length-1, p+1)), 900);
    const done = setTimeout(()=>app.go(11), 2800);
    return ()=>{ clearInterval(t); clearTimeout(done); };
  },[]);
  return (
    <>
      <StepProgress step={10} total={12}/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'var(--space-4)', padding:'0 var(--screen-gutter)' }}>
        <Spinner size={28} color="var(--siyoh)"/>
        <h1 style={{ font:'var(--type-screen-title)', textAlign:'center', margin:0 }}>Reja tayyorlanmoqda</h1>
        <span style={{ font:'var(--type-body)', color:'var(--matn-2)', textAlign:'center' }}>{O11_LINES[i]}</span>
      </div>
    </>
  );
}

function O12({ app }) {
  const [part,setPart] = React.useState(1);
  const plan = normaHisobi(app.d);
  // Recomputed on every render, so it follows weight, target, goal, activity and the
  // daily target without any separate refresh.
  const muddat = maqsadMuddati({
    goal: app.d.goal, weight: app.d.weight, target: app.d.target,
    kcal: plan.kcal, tdee: plan.tdee,
  });
  if (part === 1) return (
    <>
      <StepProgress step={11} total={12} onBack={app.prev}/>
      <Scroll>
        <div style={{ padding:'var(--space-6) var(--screen-gutter) var(--space-6)', display:'flex', flexDirection:'column', gap:'var(--block-gap)', alignItems:'center' }}>
          <span style={{ font:'var(--type-ring)', letterSpacing:'var(--ls-ring)', fontVariantNumeric:'tabular-nums' }}>{fmt(plan.kcal)}</span>
          <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', marginTop:'calc(var(--space-4) * -1)' }}>
            kunlik taxminiy maqsadingiz, kkal
          </span>
          <Note collapsible title="Nega shunday?" style={{ width:'100%' }}>
            Bo'y, vazn, yosh, jins va faollikdan kunlik sarf hisoblandi, keyin maqsadingizga qarab
            tuzatildi. Raqam taxminiy va profil o'zgarsa qayta hisoblanadi.
          </Note>
          {plan.clamped && <Note style={{ width:'100%' }}>
            Hisob pastki chegaradan past chiqdi — xavfsiz chegara qiymati berildi.
          </Note>}
          {plan.wide && <Note style={{ width:'100%' }}>
            Jins ko'rsatilmagani uchun taxmin kengroq.
          </Note>}
        </div>
      </Scroll>
      <div style={{ flex:'0 0 auto', padding:'var(--space-3) var(--screen-gutter) var(--space-6)', borderTop:'var(--hairline)' }}>
        <Button variant="primary" full onClick={()=>setPart(2)}>Davom etish</Button>
      </div>
    </>
  );
  return (
    <>
      <StepProgress step={11} total={12} onBack={()=>setPart(1)}/>
      <Scroll>
        <div style={{ padding:'var(--space-2) var(--screen-gutter) var(--space-6)', display:'flex', flexDirection:'column', gap:'var(--block-gap)' }}>
          <h1 style={{ font:'var(--type-screen-title)', letterSpacing:'var(--ls-title)', margin:0 }}>Makrolar taqsimlandi</h1>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
            {plan.macros.map(m=>(
              <Card key={m.key} style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
                <span style={{ flex:1, minWidth:0, font:'var(--type-card-title)' }}>{m.key}</span>
                <span style={{ font:'var(--type-card-title)', fontVariantNumeric:'tabular-nums' }}>{m.g} g</span>
                <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>{m.pct}%</span>
              </Card>
            ))}
          </div>
          {muddat && (
            <span style={{ font:'var(--type-body)' }}>
              Shu sur'atda maqsad vaznga taxminan {muddat.matn}da yetasiz
            </span>
          )}
          <span style={{ font:'var(--type-badge)', color:'var(--matn-2)' }}>
            Bu tibbiy tavsiya emas. Qiymatlar taxminiy.
          </span>
        </div>
      </Scroll>
      <div style={{ flex:'0 0 auto', padding:'var(--space-3) var(--screen-gutter) var(--space-6)', borderTop:'var(--hairline)' }}>
        <Button variant="primary" full onClick={()=>app.go(12)}>Boshlaymiz</Button>
      </div>
    </>
  );
}

function O13({ app }) {
  /* The last onboarding step: a plain PRO introduction. The benefit list is READ FROM
     the shared PRO_FEATURES registry rather than retyped, so this screen and the plan
     picker can never disagree about what PRO includes. The four shown are the headline
     ones; the picker lists all nine. */
  const highlights = (typeof PRO_FEATURES !== 'undefined' ? PRO_FEATURES : []).slice(0, 4);
  return (
    <>
      <StepProgress step={12} total={12} onBack={app.prev}/>
      <Scroll>
        <div style={{ padding:'var(--space-2) var(--screen-gutter) var(--space-6)', display:'flex', flexDirection:'column', gap:'var(--block-gap)' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
            <h1 style={{ font:'var(--type-screen-title)', letterSpacing:'var(--ls-title)', margin:0 }}>PRO</h1>
            <p style={{ font:'var(--type-body)', color:'var(--matn-2)', margin:0 }}>
              Ovqatlanishingizni chuqurroq kuzatib, aniqroq natijaga erishing.
            </p>
          </div>
          <Card padded={false} style={{ overflow:'hidden' }}>
            {highlights.map((f,i)=>(
              <div key={f.id} style={{
                display:'flex', alignItems:'center', gap:'var(--space-3)',
                padding:'var(--space-3) var(--space-4)',
                borderTop:i ? 'var(--hairline)' : 'none',
              }}>
                <Icon name="check" size={18} color="var(--matn-2)"/>
                <span style={{ flex:1, minWidth:0, font:'var(--type-body)' }}>{f.label}</span>
              </div>
            ))}
          </Card>
          <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
            <span style={{ font:'var(--type-card-title)' }}>FREE bilan ham ishlaydi</span>
            <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
              Kuniga 3 ta AI skan · cheksiz qo'lda kiritish · kunlik doira
            </span>
          </Card>
        </div>
      </Scroll>
      <div style={{ flex:'0 0 auto', padding:'var(--space-3) var(--screen-gutter) var(--space-6)', display:'flex', flexDirection:'column', gap:'var(--space-2)', borderTop:'var(--hairline)' }}>
        <Button variant="pro" full onClick={()=>app.openTariffs ? app.openTariffs() : app.go(13)}>PRO ni ochish</Button>
        <Button variant="tertiary" full onClick={()=>app.go(13)}>Hozir emas</Button>
      </div>
    </>
  );
}

function HomeStub({ app }) {
  const plan = normaHisobi(app.d);
  return (
    <>
      <Scroll>
        <div style={{ padding:'var(--space-4) var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--block-gap)', alignItems:'center' }}>
          <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:'var(--space-1)' }}>
            <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>Bugun, 13-sentabr</span>
            <h1 style={{ font:'var(--type-screen-title)', letterSpacing:'var(--ls-title)', margin:0 }}>
              Salom, {app.d.name || 'Aziz'}
            </h1>
          </div>
          <DailyRing value={0} goal={plan.kcal} size={224}/>
          <Note style={{ width:'100%' }}>
            Onboarding tugadi — doira maxraji O11 da hisoblangan {fmt(plan.kcal)} kkal.
            Home ekranining to'liq versiyasi <a href="../mobile-app/index.html">mobile-app</a> kitida.
          </Note>
        </div>
      </Scroll>
    </>
  );
}

Object.assign(window, { O11, O12, O13, HomeStub });
