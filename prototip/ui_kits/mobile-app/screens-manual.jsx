function SearchScreen({ app }) {
  const [q,setQ] = React.useState('');
  const [loading,setLoading] = React.useState(false);
  const list = FOODS.filter(f=>f.name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <Scroll>
      <ScreenHeader onBack={()=>app.go('home')} title={t('Taom qidiruvi')}/>
      <div style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--block-gap)', paddingBottom:'var(--space-8)' }}>
        <SearchField value={q} onChange={setQ} onClear={()=>setQ('')}/>
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
            {[0,1,2,3,4,5].map(i=><Skeleton key={i} height={72} radius="var(--r-card)"/>)}
          </div>
        ) : list.length === 0 ? (
          <EmptyState icon="search-x" title={'«' + q + '» topilmadi'}
            body="Taomni matn bilan tasvirlab bering yoki rasmga oling."
            actionLabel="Matn bilan tasvirlash" onAction={()=>app.analyze('text')}
            secondaryLabel="Rasmga olish" onSecondary={()=>app.go('camera')}/>
        ) : (
          <Section title={q ? 'Natijalar' : 'Oxirgi qo\'shilganlar'}>
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
              {list.map(f=>(
                <Card key={f.id} onClick={()=>app.openFood(f)} style={{ display:'flex', gap:'var(--space-3)', alignItems:'center' }}>
                  <FoodImage size={48}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ font:'var(--type-card-title)' }}>{f.name}</div>
                    <div style={{ font:'var(--type-caption)', color:'var(--matn-2)', marginTop:4, fontVariantNumeric:'tabular-nums' }}>
                      {f.per === 100 ? '100 g · ' + f.kcal + ' kkal' : '1 ' + f.unit + ' · ' + f.kcal + ' kkal'}
                    </div>
                  </div>
                  <Icon name="chevron-right" size={20} color="var(--matn-3)"/>
                </Card>
              ))}
            </div>
          </Section>
        )}
        <Button variant="tertiary" full onClick={()=>app.analyze('text')}>{t('Matn bilan tasvirlash')}</Button>
      </div>
    </Scroll>
  );
}

function FoodScreen({ app }) {
  const food = app.food || FOODS[0];
  const eaten = app.entries.reduce((s,e)=>s+e.kcal,0);
  const remaining = Math.max(0, GOALS.kcal - eaten);
  const advice = portionAdvice(food, remaining);
  const [portion,setPortion] = React.useState(food.portions[1] || food.portions[0]);
  const [custom,setCustom] = React.useState('');
  const [meal,setMeal] = React.useState('Tushlik');
  const [saving,setSaving] = React.useState(false);
  const [failed,setFailed] = React.useState(false);
  const qty = custom ? Number(custom) || 0 : portion;
  const mult = food.per === 100 ? qty / 100 : qty;
  const kcal = Math.round(food.kcal * mult);
  const label = food.per === 100 ? qty + ' g' : qty + ' ' + food.unit;

  return (
    <Scroll>
      <ScreenHeader onBack={()=>app.go('search')} title={food.name}/>
      <div style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--block-gap)', paddingBottom:'var(--space-8)' }}>
        <FoodImage/>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'var(--text-to-caption)' }}>
          <span style={{ font:'var(--type-ring)', letterSpacing:'var(--ls-ring)', fontVariantNumeric:'tabular-nums' }}>{fmt(kcal)}</span>
          <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>kkal · {label}</span>
        </div>
        <div style={{ display:'flex', gap:'var(--space-4)' }}>
          <MacroBar label={t('Oqsil')} value={Math.round(food.p*mult)} goal={GOALS.p}/>
          <MacroBar label={t("Yog'")} value={Math.round(food.fat*mult)} goal={GOALS.fat}/>
          <MacroBar label={t('Uglevod')} value={Math.round(food.c*mult)} goal={GOALS.c}/>
        </div>
        <Section title={t('Porsiya')}>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
            <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap' }}>
              {food.portions.map(p=>(
                <Chip key={p} selected={!custom && portion===p} onClick={()=>{ setCustom(''); setPortion(p); }}>
                  {food.per === 100 ? p + ' g' : p + ' ' + food.unit}
                </Chip>
              ))}
              <Input style={{ width:120 }} value={custom} onChange={setCustom} placeholder="Boshqa" unit={food.per===100?'g':food.unit} numeric/>
            </div>
            {!proOpen('porsiya', app) ? (
              <ProLock compact title={proLabel('porsiya') + ' — PRO'}
                onUnlock={()=>app.openTariffs('porsiya')}/>
            ) : advice == null ? null : (
              <Card onClick={()=>{ setCustom(''); setPortion(advice.qty); }}
                style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
                <Icon name="scale" size={20} color="var(--matn-2)"/>
                <span style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:'var(--space-1)' }}>
                  <span style={{ font:'var(--type-card-title)', fontVariantNumeric:'tabular-nums' }}>
                    Tavsiya: {advice.label}
                  </span>
                  <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>
                    {fmt(advice.kcal)} kkal — {advice.capped
                      ? 'odatdagi katta porsiya, qolgan ' + fmt(remaining) + ' kkal ichida'
                      : 'qolgan ' + fmt(remaining) + ' kkal ichida'}
                  </span>
                </span>
                <Icon name="chevron-right" size={20} color="var(--matn-3)"/>
              </Card>
            )}
          </div>
        </Section>
        <Section title={t('Ovqat turi')}>
          <SegmentedControl options={MEALS.map(m=>({value:m,label:t(m)}))} value={meal} onChange={setMeal}/>
        </Section>
        <Button variant="primary" full loading={saving} onClick={()=>{
          setSaving(true);
          setTimeout(()=>{
            setSaving(false);
            if (app.failNextSave) { setFailed(true); return; }
            app.commit({ food:food.name, portion:label, kcal, p:food.p*mult, fat:food.fat*mult, c:food.c*mult, meal, ai:false });
          }, 800);
        }}>{t("Jurnalga qo'shish")}</Button>
        {failed && <ErrorState inline title={t('Saqlanmadi. Qayta urinish')} onRetry={()=>setFailed(false)}
          style={{ borderRadius:'var(--r-card)', border:'1px solid var(--xato)' }}/>}
      </div>
    </Scroll>
  );
}

Object.assign(window, { SearchScreen, FoodScreen });
