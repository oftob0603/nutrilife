function HomeScreen({ app }) {
  const { entries, state, go, openSheet, tab, setTab } = app;
  const total = entries.reduce((s,e)=>s+e.kcal,0);
  const macro = (k) => entries.reduce((s,e)=>s+(e[k]||0),0);
  const loading = state === 'loading';
  const error = state === 'error';
  const score = nutritionScore(entries, GOALS);
  const remaining = Math.max(0, GOALS.kcal - total);
  const suggestion = mealSuggestion(remaining);

  return (
    <>
      {app.offline && <OfflineBar/>}
      <Scroll>
        <ScreenHeader subtitle={sanaToliq(app.todayIso)} title={t1('Xush kelibsiz, {0}', app.profile.ism)}/>
        <div style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--block-gap)', paddingBottom:140 }}>
          <DayPicker value={4} onChange={()=>{}}/>

          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'var(--space-3)' }}>
              <Skeleton height={220} circle/>
              <Skeleton height={12} width="40%"/>
            </div>
          ) : error ? (
            <ErrorState title="Ma'lumotni yuklab bo'lmadi" body="Hisobot serveriga ulanolmadik." onRetry={()=>app.setState('ready')}/>
          ) : (
            <DailyRing value={total} goal={GOALS.kcal} size={224}/>
          )}

          {loading ? (
            <div style={{ display:'flex', gap:'var(--space-4)' }}>
              {[0,1,2].map(i=><Skeleton key={i} height={32} radius="var(--r-chip)"/>)}
            </div>
          ) : proOpen('makro', app) ? (
            <div style={{ display:'flex', gap:'var(--space-4)' }}>
              <MacroBar label={t('Oqsil')} value={Math.round(macro('p'))} goal={GOALS.p}/>
              <MacroBar label={t("Yog'")} value={Math.round(macro('fat'))} goal={GOALS.fat}/>
              <MacroBar label={t('Uglevod')} value={Math.round(macro('c'))} goal={GOALS.c}/>
            </div>
          ) : (
            <ProLock compact title={proLabel('makro') + ' — PRO'} onUnlock={()=>app.openTariffs('makro')}/>
          )}

          {!loading && (
            <Section title={t('Nutrition Score')}>
              {!proOpen('score', app) ? (
                <ProLock title={proLabel('score')}
                  caption="Kunlik ovqatlanish muvozanatini 0–100 ball bilan ko'rsatadi."
                  onUnlock={()=>app.openTariffs('score')}/>
              ) : score == null ? (
                <Card>
                  <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
                    {t("Ball bugungi yozuvlardan hisoblanadi \u2014 birinchi ovqatni qo'shsangiz chiqadi.")}
                  </span>
                </Card>
              ) : (
                <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'var(--space-2)' }}>
                    <span style={{ font:'var(--type-ring)', fontSize:40, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>
                      {score.score}
                    </span>
                    <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>/ 100 · {score.band}</span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
                    {score.parts.map(p=>(
                      <MacroBar key={p.label} label={p.label} value={p.value} goal={100} unit=""/>
                    ))}
                  </div>
                  <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
                    {t1("Eng past ko'rsatkich \u2014 {0}.", t(score.weakest.label).toLowerCase())}
                  </span>
                </Card>
              )}
            </Section>
          )}

          <Section title={t('Bugungi ovqatlar')} action={entries.length ? t('Hammasi') : null} onAction={()=>go('journal')}>
            {entries.length === 0 ? (
              <Card>
                <EmptyState icon="utensils" title="Bugun hali hech narsa qo'shilmadi"
                  body="Birinchi ovqatni qo'shsangiz, doira to'lishni boshlaydi."
                  actionLabel="Birinchi ovqatni qo'shish" onAction={openSheet} style={{ padding:'var(--space-4) 0' }}/>
              </Card>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
                {entries.slice(-3).reverse().map(e=>(
                  <LogEntry key={e.id} name={e.food} portion={e.portion} time={e.time} kcal={e.kcal} ai={e.ai}
                    onClick={()=>app.editEntry(e)}/>
                ))}
              </div>
            )}
          </Section>

          <Section title={t('Qolgan kaloriyaga mos')}>
            {!proOpen('taklif', app) ? (
              <ProLock title={proLabel('taklif')}
                caption="Qolgan kaloriyangizga sig'adigan taomlar tanlanadi."
                onUnlock={()=>app.openTariffs('taklif')}/>
            ) : suggestion == null ? (
              <Card>
                <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
                  {remaining <= 0
                    ? "Kunlik norma to'ldi — bugunga taklif yo'q."
                    : t1('Qolgan {0} kkal uchun mos taom topilmadi.', fmt(remaining))}
                </span>
              </Card>
            ) : (
              <Card padded={false} onClick={()=>app.openFood(suggestion.food)}
                style={{ display:'flex', gap:'var(--space-3)', padding:'var(--card-padding)', alignItems:'center' }}>
                <FoodImage size={56}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ font:'var(--type-card-title)' }}>{suggestion.food.name}</div>
                  <div style={{ font:'var(--type-caption)', color:'var(--matn-2)', marginTop:4, fontVariantNumeric:'tabular-nums' }}>
                    {t1('{0} \u00b7 {1} kkal \u00b7 qolgan {2} kkal ichida', suggestion.label, fmt(suggestion.kcal), fmt(remaining))}
                  </div>
                </div>
                <Icon name="chevron-right" size={20} color="var(--matn-3)"/>
              </Card>
            )}
          </Section>
        </div>
      </Scroll>
      <div style={{ position:'absolute', left:'var(--screen-gutter)', right:'var(--screen-gutter)', bottom:'var(--above-bottom-bar)' }}>
        <BottomBar value={tab} onChange={setTab} onAdd={openSheet}/>
      </div>
    </>
  );
}

function JournalScreen({ app }) {
  const { entries, go } = app;
  const total = entries.reduce((s,e)=>s+e.kcal,0);
  const grouped = MEALS.map(m=>({ meal:m, items:entries.filter(e=>e.meal===m) })).filter(g=>g.items.length);
  return (
    <>
      <Scroll>
        <ScreenHeader onBack={()=>go('home')} subtitle={sanaToliq(app.todayIso)} title={t('Jurnal')}/>
        <div style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--block-gap)', paddingBottom:140 }}>
          <DailyTotals kcal={total} goal={GOALS.kcal} macros={proOpen('makro', app) ? [
            { label:t('Oqsil'), value:Math.round(entries.reduce((s,e)=>s+e.p,0)) },
            { label:t("Yog'"), value:Math.round(entries.reduce((s,e)=>s+e.fat,0)) },
            { label:t('Uglevod'), value:Math.round(entries.reduce((s,e)=>s+e.c,0)) },
          ] : []}/>
          {!proOpen('makro', app) && (
            <ProLock compact title={proLabel('makro') + ' — PRO'} onUnlock={()=>app.openTariffs('makro')}/>
          )}
          {grouped.length === 0 ? (
            <EmptyState icon="notebook-pen" title={t("Bu kunda yozuv yo'q")}
              body="Ovqat qo'shsangiz, u shu yerda ovqat turi bo'yicha guruhlanadi."
              actionLabel="Ovqat qo'shish" onAction={app.openSheet}/>
          ) : grouped.map(g=>(
            <Section key={g.meal} title={g.meal}>
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
                {g.items.map(e=>(
                  <LogEntry key={e.id} name={e.food} portion={e.portion} time={e.time} kcal={e.kcal} ai={e.ai}
                    onClick={()=>app.editEntry(e)}/>
                ))}
              </div>
            </Section>
          ))}
        </div>
      </Scroll>
      <div style={{ position:'absolute', left:'var(--screen-gutter)', right:'var(--screen-gutter)', bottom:'var(--above-bottom-bar)' }}>
        <BottomBar value={app.tab} onChange={app.setTab} onAdd={app.openSheet}/>
      </div>
    </>
  );
}

function EditScreen({ app }) {
  const e = app.draft || {};
  const [name,setName] = React.useState(e.food || '');
  const [grams,setGrams] = React.useState(String(parseInt(e.portion) || 0));
  const [kcal,setKcal] = React.useState(String(e.kcal || 0));
  const [meal,setMeal] = React.useState(e.meal || 'Tushlik');
  const [saving,setSaving] = React.useState(false);
  const [confirm,setConfirm] = React.useState(false);
  return (
    <>
      <Scroll>
        <ScreenHeader onBack={()=>app.go(app.from)} title={t('Yozuvni tahrirlash')}/>
        <div style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--space-4)', paddingBottom:'var(--space-8)' }}>
          <FoodImage/>
          <Input label={t('Taom nomi')} value={name} onChange={setName}/>
          <div style={{ display:'flex', gap:'var(--space-3)' }}>
            <Input style={{ flex:1 }} label={t('Porsiya')} value={grams} onChange={setGrams} unit="g" numeric/>
            <Input style={{ flex:1 }} label={t('Kaloriya')} value={kcal} onChange={setKcal} unit={t('kkal')} numeric/>
          </div>
          <div style={{ display:'flex', gap:'var(--space-3)' }}>
            <Input style={{ flex:1 }} label={t('Oqsil')} value={String(Math.round(e.p||0))} unit="g" numeric/>
            <Input style={{ flex:1 }} label={t("Yog'")} value={String(Math.round(e.fat||0))} unit="g" numeric/>
            <Input style={{ flex:1 }} label={t('Uglevod')} value={String(Math.round(e.c||0))} unit="g" numeric/>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
            <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{t('Ovqat turi')}</span>
            <SegmentedControl options={MEALS.map(m=>({value:m,label:t(m)}))} value={meal} onChange={setMeal}/>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)', marginTop:'var(--space-2)' }}>
            <Button variant="primary" full loading={saving} onClick={()=>{
              setSaving(true);
              setTimeout(()=>{ setSaving(false); app.saveEdit({ ...e, food:name, portion:grams+' g', kcal:Number(kcal)||0, meal }); }, 700);
            }}>{t('Saqlash')}</Button>
            <Button variant="secondary" full onClick={()=>app.duplicate(e)}>{t('Nusxalash')}</Button>
            {confirm ? (
              <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)', borderColor:'var(--xato)' }}>
                <span style={{ font:'var(--type-body)' }}>{t("Bu yozuvni o'chiramizmi? Doira shu qiymatga kamayadi.")}</span>
                <div style={{ display:'flex', gap:'var(--space-2)' }}>
                  <Button variant="danger" size="sm" onClick={()=>app.remove(e)}>{t("O'chirish")}</Button>
                  <Button variant="tertiary" size="sm" onClick={()=>setConfirm(false)}>{t('Bekor qilish')}</Button>
                </div>
              </Card>
            ) : <Button variant="danger" full onClick={()=>setConfirm(true)}>{t("O'chirish")}</Button>}
          </div>
        </div>
      </Scroll>
    </>
  );
}

Object.assign(window, { HomeScreen, JournalScreen, EditScreen });
