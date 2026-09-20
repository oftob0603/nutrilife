function CameraScreen({ app }) {
  const [shot,setShot] = React.useState(false);
  return (
    <div data-theme="dark" style={{ flex:1, background:'var(--fon)', color:'var(--siyoh)', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'var(--space-4) var(--screen-gutter)' }}>
        <button type="button" onClick={()=>app.go('home')} aria-label={t('Orqaga')} style={{
          width:44, height:44, border:0, background:'transparent', color:'var(--siyoh)', cursor:'pointer',
          display:'inline-flex', alignItems:'center', justifyContent:'center',
        }}><Icon name="chevron-left" size={24}/></button>
        <span style={{ font:'var(--type-caption)', opacity:.7 }}>{shot ? "Rasmni ko'rib chiqing" : 'Kamera'}</span>
        <span style={{ width:44 }}/>
      </div>
      <div style={{ flex:1, minHeight:0, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ position:'absolute', inset:'var(--screen-gutter)', borderRadius:'var(--r-card)', background:'var(--karta)' }}/>
        {!shot && <div style={{ position:'relative', width:260, height:260, border:'1px solid rgba(242,242,243,.35)', borderRadius:'var(--r-card)' }}/>}
        {!shot && <span style={{ position:'absolute', bottom:24, left:24, right:24, textAlign:'center', font:'var(--type-caption)', color:'rgba(242,242,243,.7)' }}>
          {t("Taomni tepadan, to'liq ko'rinishda oling")}
        </span>}
      </div>
      <div style={{ padding:'var(--space-6) var(--screen-gutter) var(--space-8)' }}>
        {shot ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
            <Button variant="accent" full onClick={()=>app.analyze('photo')}>{t('Tahlil qilish')}</Button>
            <Button variant="tertiary" full style={{ color:'var(--siyoh)' }} onClick={()=>setShot(false)}>{t('Qayta olish')}</Button>
          </div>
        ) : (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <button type="button" aria-label={t('Galereya')} style={{
              width:44, height:44, borderRadius:'var(--r-chip)', border:'1px solid rgba(242,242,243,.25)',
              background:'transparent', color:'var(--siyoh)', cursor:'pointer', display:'inline-flex',
              alignItems:'center', justifyContent:'center',
            }}><Icon name="image" size={20}/></button>
            <button type="button" aria-label={t('Rasmga olish')} onClick={()=>setShot(true)} style={{
              width:72, height:72, borderRadius:'50%', border:'4px solid rgba(242,242,243,.35)',
              background:'var(--siyoh)', cursor:'pointer',
            }}/>
            <span style={{ width:44 }}/>
          </div>
        )}
      </div>
    </div>
  );
}

const STEPS = ['Taom aniqlanmoqda','Porsiya baholanmoqda','Kaloriya hisoblanmoqda'];

function AnalyzingScreen({ app }) {
  const [i,setI] = React.useState(0);
  const [slow,setSlow] = React.useState(false);
  React.useEffect(()=>{
    const a = setInterval(()=>setI(x=>Math.min(STEPS.length-1, x+1)), 900);
    const b = setTimeout(()=>setSlow(true), 2800);
    const c = setTimeout(()=>app.go(app.aiFails ? 'ai-error' : 'result'), 3400);
    return ()=>{ clearInterval(a); clearTimeout(b); clearTimeout(c); };
  },[]);
  return (
    <div style={{ flex:1, position:'relative', background:'var(--fon)', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'relative', flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'var(--space-4)', padding:'0 var(--screen-gutter)' }}>
        <div style={{
          position:'relative', width:'100%', maxWidth:260, aspectRatio:'1',
          borderRadius:'var(--r-card)', overflow:'hidden', background:'var(--chegara)',
        }}>
          <FoodImage radius="0" style={{ width:'100%', height:'100%', aspectRatio:'auto' }}/>
          {/* The scanning line: a soft band travelling down the photo, once per pass. */}
          <span aria-hidden="true" style={{
            position:'absolute', left:0, right:0, top:0, height:'10%',
            background:'linear-gradient(to bottom, transparent, var(--aksent), transparent)',
            opacity:.9, animation:'nutrilife-scan var(--scan-duration) var(--ease) infinite',
          }}/>
        </div>
        <h1 style={{ font:'var(--type-screen-title)', textAlign:'center' }}>{t('Ovqatingiz tahlil qilinmoqda…')}</h1>
        <span key={i} style={{
          font:'var(--type-body)', color:'var(--matn-2)',
        }}>{t(STEPS[i])}</span>
        {slow && <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>Biroz cho'zilmoqda, kutamiz…</span>}
      </div>
      <div style={{ position:'relative', padding:'var(--space-6) var(--screen-gutter) var(--space-8)' }}>
        <Button variant="tertiary" full onClick={()=>app.go('home')}>{t('Bekor qilish')}</Button>
      </div>
    </div>
  );
}

function AiErrorScreen({ app }) {
  return (
    <Scroll>
      <ScreenHeader onBack={()=>app.go('home')} title={t('Tahlil')}/>
      <div style={{ padding:'0 var(--screen-gutter)' }}>
        <ErrorState title={t('Taomni aniq taniy olmadik')}
          body="Rasmda bir nechta taom bor yoki yorug'lik yetmagan. Qiymatni o'zimiz uydirmaymiz."
          retryLabel="Boshqa rasm olish" onRetry={()=>app.go('camera')}
          altLabel="Qo'lda qo'shish" onAlt={()=>app.go('search')}/>
        <Button variant="tertiary" full style={{ marginTop:'var(--space-3)' }} onClick={()=>app.go('result-blank')}>{t('Baribir tahrirlab kiritish')}</Button>
      </div>
    </Scroll>
  );
}

function ResultScreen({ app, blank = false }) {
  const guess = { food:'Osh', grams:250, kcal:465, p:16, fat:20, c:55 };
  const [name,setName] = React.useState(blank ? '' : guess.food);
  const [grams,setGrams] = React.useState(blank ? '' : String(guess.grams));
  const [kcal,setKcal] = React.useState(blank ? '' : String(guess.kcal));
  const [meal,setMeal] = React.useState('Tushlik');
  const [saving,setSaving] = React.useState(false);
  // "~" marks a value the AI estimated. The moment the user types a weight, the portion
  // and everything derived from it are exact — so the symbol disappears.
  const [edited,setEdited] = React.useState(blank);
  const est = !blank && !edited;
  const approx = (v) => (est ? '~' + v : String(v));
  const g = Number(grams) || 0;
  const scaled = blank ? Number(kcal)||0 : Math.round(guess.kcal * (g / guess.grams || 0));
  const eaten = app.entries.reduce((sum,e)=>sum+e.kcal,0);
  const remaining = Math.max(0, GOALS.kcal - eaten);
  // Advice is computed against the AI's per-portion density, not a fixed food row.
  const density = guess.kcal / guess.grams;
  const fitGrams = density > 0 ? Math.floor(remaining / density / 10) * 10 : 0;
  const invalid = (blank ? Number(kcal)||0 : scaled) <= 0 || !name.trim();
  const macro = (base) => String(Math.round(base * (g / guess.grams || 0)));

  return (
    <Scroll>
      <ScreenHeader onBack={()=>app.go('home')} title={blank ? "Ma'lumotni o'zingiz kiriting" : 'Natija'}/>
      <div style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--space-4)', paddingBottom:'var(--space-8)' }}>
        <FoodImage style={{ maxHeight:160 }}/>
        {!blank && (
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:'var(--space-2)' }}>
              <CountUp value={scaled} from={0} format={(n)=>approx(fmt(n))}
                style={{ font:'var(--type-ring)', fontSize:44, lineHeight:1 }}/>
              <span style={{ font:'var(--type-card-title)', color:'var(--matn-2)' }}>kkal</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', flexWrap:'wrap' }}>
              <Badge tone="ai" onClick={()=>app.openTariffs('skan')}>{t('AI taxmini')}</Badge>
            </div>
          </div>
        )}
        <Input label={t('Taom nomi')} value={name} onChange={setName} placeholder="Osh"/>
        <div style={{ display:'flex', gap:'var(--space-3)' }}>
          <Input style={{ flex:1 }} label={t('Porsiya')} value={approx(grams)} unit="g" numeric
            onChange={(v)=>{ setEdited(true); setGrams(v.replace('~','')); }}/>
          <Input style={{ flex:1 }} label={t('Kaloriya')} value={blank ? kcal : approx(scaled)} unit={t('kkal')} numeric
            onChange={(v)=>{ setEdited(true); setKcal(v.replace('~','')); }}
            error={invalid ? t("0 dan katta bo'lishi kerak") : undefined}/>
        </div>
        {est && (
          <span style={{
            display:'flex', gap:'var(--space-2)', alignItems:'flex-start',
            font:'var(--type-badge)', lineHeight:1.45, color:'var(--matn-2)', textWrap:'pretty',
            marginTop:'calc(var(--space-2) * -1)',
          }}>
            <Icon name="sparkles" size={12} color="var(--aksent-matn)" style={{ flex:'0 0 auto', marginTop:3 }}/>
            <span style={{ flex:1, minWidth:0 }}>
              AI porsiyani taxmin qildi. Og'irlikni aniq kiritsangiz, natija yanada aniq bo'ladi.
            </span>
          </span>
        )}
        {!blank && (
          proOpen('porsiya', app) ? (
            fitGrams > 0 && fitGrams < g ? (
              <Card onClick={()=>{ setEdited(true); setGrams(String(fitGrams)); }}
                style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
                <Icon name="scale" size={20} color="var(--matn-2)"/>
                <span style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:'var(--space-1)' }}>
                  <span style={{ font:'var(--type-card-title)', fontVariantNumeric:'tabular-nums' }}>
                    Tavsiya: {fitGrams} g
                  </span>
                  <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>
                    {t1('Qolgan {0} kkal ichida qoladi', fmt(remaining))}
                  </span>
                </span>
                <Icon name="chevron-right" size={20} color="var(--matn-3)"/>
              </Card>
            ) : null
          ) : (
            <ProLock compact title={proLabel('porsiya') + ' — PRO'}
              onUnlock={()=>app.openTariffs('porsiya')}/>
          )
        )}
        <div style={{ display:'flex', gap:'var(--space-3)' }}>
          <Input style={{ flex:1 }} label={t('Oqsil')} value={blank ? '' : approx(macro(guess.p))} unit="g" numeric/>
          <Input style={{ flex:1 }} label={t("Yog'")} value={blank ? '' : approx(macro(guess.fat))} unit="g" numeric/>
          <Input style={{ flex:1 }} label={t('Uglevod')} value={blank ? '' : approx(macro(guess.c))} unit="g" numeric/>
        </div>
        <Section title={t('Ovqat turi')}><SegmentedControl options={MEALS.map(m=>({value:m,label:t(m)}))} value={meal} onChange={setMeal}/></Section>
        <Button variant="accent" full disabled={invalid} loading={saving} onClick={()=>{
          setSaving(true);
          setTimeout(()=>{
            setSaving(false);
            const k = blank ? Number(kcal)||0 : scaled;
            app.commit({ food:name, portion:g+' g', kcal:k, p:guess.p*(g/guess.grams||0), fat:guess.fat*(g/guess.grams||0), c:guess.c*(g/guess.grams||0), meal, ai:!blank });
          }, 800);
        }}>{t("Tasdiqlash va qo'shish")}</Button>
        <Button variant="tertiary" full onClick={()=>app.go('home')}>{t('Bekor qilish')}</Button>
      </div>
    </Scroll>
  );
}

function AddedScreen({ app }) {
  const last = app.entries[app.entries.length-1] || {};
  const total = app.entries.reduce((s,e)=>s+e.kcal,0);
  React.useEffect(()=>{ const timer = setTimeout(()=>app.go('home'), 4000); return ()=>clearTimeout(timer); },[]);
  return (
    <Scroll>
      <div style={{ padding:'var(--space-8) var(--screen-gutter)', display:'flex', flexDirection:'column', alignItems:'center', gap:'var(--block-gap)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
          <span style={{ width:24, height:24, borderRadius:'50%', background:'var(--aksent)', color:'var(--aksent-matn)', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name="check" size={14}/>
          </span>
          <span style={{ font:'var(--type-card-title)' }}>{t("Jurnalga qo'shildi")}</span>
        </div>
        <DailyRing value={total} goal={GOALS.kcal} size={224}/>
        <Card style={{ width:'100%', display:'flex', gap:'var(--space-3)', alignItems:'center' }}>
          <FoodImage size={48}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ font:'var(--type-card-title)' }}>{last.food}</div>
            <div style={{ font:'var(--type-caption)', color:'var(--matn-2)', marginTop:4, fontVariantNumeric:'tabular-nums' }}>
              {tPorsiya(last.portion)} \u00b7 {t1('{0} kkal', fmt(last.kcal||0))}
            </div>
          </div>
          {last.ai && <Badge tone="ai">{t('AI taxmini')}</Badge>}
        </Card>
        <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
          <Button variant="primary" full onClick={()=>app.go('home')}>Home'ga qaytish</Button>
          <Button variant="tertiary" full onClick={app.openSheet}>{t("Yana qo'shish")}</Button>
        </div>
      </div>
    </Scroll>
  );
}

Object.assign(window, { CameraScreen, AnalyzingScreen, AiErrorScreen, ResultScreen, AddedScreen });
