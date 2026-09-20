// P1 Statistika · P2 add weight · P3 weight history.
// progress-tz: the page shows the user's own numbers and never interprets them —
// no BMI, no healthy-range band, no forecast, no streak-pressure warnings.

function ProgressScreen({ app }) {
  const [range,setRange] = React.useState('30');
  const w = weightPoints(app.weights);
  const last = w[w.length-1];
  const first = w[0];
  const loading = app.state === 'loading';
  const error = app.state === 'error';
  const onePoint = w.length < 2;
  const noStreak = app.entries.length === 0 && app.streak.joriy === 0;
  const shown = range === 'all' ? w : w.slice(range === '30' ? -8 : -12);
  const maqsad = app.profile.maqsad_vazn;
  const qolgan = Math.abs(last.kg - maqsad);
  const foiz = maqsadFoizi(w, maqsad);
  const hafta = haftalikOzgarish(w);
  const kuzatilgan = TRACKED.filter(d=>d.tracked).length;
  // Both read the live history, so today's edits are included immediately.
  const [statRange,setStatRange] = React.useState(30);
  const stats = detailedStats(app.history, GOALS, statRange);
  const week = weekReport(app.history, GOALS);

  return (
    <>
      {app.offline && <OfflineBar/>}
      <Scroll>
        <ScreenHeader title={t('Statistika')}/>
        <div style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--block-gap)', paddingBottom:140 }}>
          {error ? (
            <ErrorState title="Ma'lumotni yuklab bo'lmadi" onRetry={()=>app.setState('ready')}/>
          ) : loading ? (
            <>
              <Skeleton height={132} radius="var(--r-card)"/>
              <Skeleton height={52} radius="var(--r-pill)"/>
              <Skeleton height={160} radius="var(--r-card)"/>
              <Skeleton height={96} radius="var(--r-card)"/>
            </>
          ) : (
            <>
              <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:'var(--space-2)' }}>
                  <span style={{ font:'var(--type-ring)', fontSize:48, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>
                    {kg1(last.kg)}
                  </span>
                  <span style={{ font:'var(--type-card-title)', color:'var(--matn-2)' }}>{t('kg')}</span>
                  {!onePoint && (
                    <span style={{ font:'var(--type-card-title)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums', marginLeft:'auto' }}>
                      {t1('{0} kg', delta(last.kg, first.kg))}
                    </span>
                  )}
                </div>
                {/* Goal and remainder are stated once, in the chart card's summary strip
                   (see below) — this card keeps the progress bar, which is the one reading
                   of the same data the strip does not give. */}
                {foiz != null && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
                    <span style={{ height:8, borderRadius:'var(--r-pill)', background:'var(--chegara)', overflow:'hidden' }}>
                      <span style={{
                        display:'block', width:foiz+'%', height:'100%', borderRadius:'var(--r-pill)',
                        background:'var(--aksent)',
                      }}/>
                    </span>
                    <span style={{ font:'var(--type-badge)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>
                      {t1("Yo'lning {0}% i bosib o'tildi", foiz)}
                    </span>
                  </div>
                )}
              </Card>

              <Button variant="primary" full onClick={()=>app.openWeight()}>
                <Icon name="plus" size={20}/>{t('Vaznni qayd etish')}</Button>

              <Section title={t('Vazn grafigi')}>
                <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
                  {!onePoint && (
                    <SegmentedControl value={range} onChange={setRange}
                      options={[{value:'30',label:t1('{0} kun',30)},{value:'90',label:t1('{0} kun',90)},{value:'all',label:t('Hammasi')}]}/>
                  )}
                  <WeightChart points={shown} goal={app.profile.maqsad_vazn} height={180} animate={false}/>
                  {/* Summary strip, as in the reference: the range's net change beside the
                      goal and what is left of it. Both figures are derived from `shown`,
                      the same series the line is drawn from, so the strip cannot disagree
                      with the chart above it. */}
                  {shown.length > 1 && (
                    <div style={{
                      display:'flex', alignItems:'center', gap:'var(--space-4)',
                      padding:'var(--space-3) var(--space-4)', borderRadius:'var(--r-card)',
                      background:'var(--fon)',
                    }}>
                      <span style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', flex:1, minWidth:0 }}>
                        <Icon name={shown[shown.length-1].kg <= shown[0].kg ? 'trending-down' : 'trending-up'}
                          size={18} color="var(--matn-2)"/>
                        <span style={{ display:'flex', flexDirection:'column', minWidth:0 }}>
                          <span style={{ font:'var(--type-card-title)', fontVariantNumeric:'tabular-nums' }}>
                            {t1('{0} kg', delta(shown[shown.length-1].kg, shown[0].kg))}
                          </span>
                          <span style={{ font:'var(--type-badge)', color:'var(--matn-2)' }}>
                            {range === 'all' ? t('Hammasi') : t1('oxirgi {0} kunda', range)}
                          </span>
                        </span>
                      </span>
                      <span style={{ width:1, alignSelf:'stretch', background:'var(--chegara)' }}/>
                      <span style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', flex:1, minWidth:0 }}>
                        <Icon name="target" size={18} color="var(--matn-2)"/>
                        <span style={{ display:'flex', flexDirection:'column', minWidth:0 }}>
                          <span style={{ font:'var(--type-card-title)', fontVariantNumeric:'tabular-nums' }}>
                            {t1('Maqsad: {0} kg', app.profile.maqsad_vazn)}
                          </span>
                          <span style={{ font:'var(--type-badge)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>
                            {t1('Yana {0} kg', kg1(qolgan))}
                          </span>
                        </span>
                      </span>
                    </div>
                  )}
                  {onePoint && (
                    <Button variant="secondary" full onClick={()=>app.openWeight()}>{t("Vazn qo'shish")}</Button>
                  )}
                </Card>
              </Section>

              {noStreak ? (
                <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
                  <span style={{ font:'var(--type-card-title)' }}>{t('Streak hali boshlanmagan')}</span>
                  <Button variant="secondary" full onClick={app.openSheet}>{t("Birinchi ovqatni qo'shing")}</Button>
                </Card>
              ) : (
                <Card style={{ display:'flex', alignItems:'center', gap:'var(--space-4)' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', flex:1, minWidth:0 }}>
                    <Icon name="flame" size={20} color="var(--matn-2)"/>
                    <span key={app.streak.joriy} style={{
                      font:'var(--type-card-title)', fontVariantNumeric:'tabular-nums',
                      display:'inline-block', transformOrigin:'left center',
                      animation: app.streakGrew ? 'nutrilife-bump var(--asos) var(--ease) both' : undefined,
                    }}>{t1('{0} kunlik streak', app.streak.joriy)}</span>
                  </span>
                  <span style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
                    <Icon name="trophy" size={16} color="var(--matn-3)"/>
                    <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap' }}>
                      {t1('Rekord: {0} kun', app.streak.eng_uzun)}
                    </span>
                  </span>
                </Card>
              )}

              <Section title={t('Kuzatilgan kunlar')}>
                <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
                  <span style={{ font:'var(--type-card-title)', fontVariantNumeric:'tabular-nums' }}>
                    {t1('{0} / {1} kun', kuzatilgan, TRACKED.length)}
                  </span>
                  <DayGrid days={TRACKED} onDayClick={()=>app.go('journal')}/>
                  <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{t("Oxirgi 30 kun. Kuzatilgan kunni bosing — o'sha kundagi jurnal ochiladi.")}</span>
                </Card>
              </Section>

              {/* The standalone «Maqsadgacha» card is gone: the chart card's summary strip
                 already states the goal and the remainder. «Haftalik o'zgarish» stays — a
                 per-week RATE is not the strip's net change over the range. */}
              {hafta != null && (
                <Card style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
                  <Icon name="trending-down" size={20} color="var(--matn-2)"/>
                  <span style={{ flex:1, minWidth:0, font:'var(--type-caption)', color:'var(--matn-2)' }}>{t("Haftalik o'zgarish")}</span>
                  <span style={{ font:'var(--type-card-title)', fontVariantNumeric:'tabular-nums' }}>
                    {t1('{0} kg / hafta', delta(hafta, 0))}
                  </span>
                </Card>
              )}

              <Section title={t('Batafsil ovqatlanish statistikasi')}>
                {!proOpen('statistika', app) ? (
                  <ProLock title={proLabel('statistika')}
                    caption="O'rtacha kaloriya, makro taqsimoti va normaga mos kunlar."
                    onUnlock={()=>app.openTariffs('statistika')}/>
                ) : stats == null ? (
                  <Card>
                    <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{t('Statistika uchun kamida ikki kunlik yozuv kerak.')}</span>
                  </Card>
                ) : (
                  <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
                    <SegmentedControl value={String(statRange)} onChange={(v)=>setStatRange(Number(v))}
                      options={[{value:'7',label:t1('{0} kun',7)},{value:'30',label:t1('{0} kun',30)}]}/>
                    <div style={{ display:'flex', alignItems:'baseline', gap:'var(--space-2)' }}>
                      <span style={{ font:'var(--type-ring)', fontSize:40, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>
                        {fmt(stats.avgKcal)}
                      </span>
                      <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
                        {t('kkal — kunlik o\u2018rtacha')}
                      </span>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
                      <MacroBar label={t('Oqsil')} value={stats.avgProtein} goal={GOALS.p}/>
                      <MacroBar label={t("Yog'")} value={stats.avgFat} goal={GOALS.fat}/>
                      <MacroBar label={t('Uglevod')} value={stats.avgCarb} goal={GOALS.c}/>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
                      {[
                        [t('Makro taqsimoti'), stats.split.p + ' / ' + stats.split.fat + ' / ' + stats.split.c + '%'],
                        [t('Normaga mos kunlar'), stats.withinGoal + ' / ' + stats.days],
                        [t('Normadan oshgan kunlar'), String(stats.over)],
                        [t('Eng past kun'), t1('{0} kkal \u00b7 {1}', fmt(stats.lowest.kcal), sanaQisqa(stats.lowest.iso))],
                        [t('Eng baland kun'), t1('{0} kkal \u00b7 {1}', fmt(stats.highest.kcal), sanaQisqa(stats.highest.iso))],
                        [t('Kuzatilgan kunlar'), stats.trackedShare + '%'],
                      ].concat(stats.avgScore != null ? [[t("O'rtacha Nutrition Score"), stats.avgScore + ' / 100']] : [])
                       .map(([k,v])=>(
                        <span key={k} style={{ display:'flex', gap:'var(--space-3)', font:'var(--type-caption)' }}>
                          <span style={{ flex:1, minWidth:0, color:'var(--matn-2)' }}>{k}</span>
                          <span style={{ fontVariantNumeric:'tabular-nums' }}>{v}</span>
                        </span>
                      ))}
                    </div>
                    <span style={{ font:'var(--type-badge)', color:'var(--matn-2)' }}>
                      {t("O'rtachalar faqat yozuv bor kunlardan olinadi \u2014 bo'sh kun nol deb hisoblanmaydi.")}
                    </span>
                  </Card>
                )}
              </Section>

              <Section title={t('Haftalik ovqatlanish hisoboti')}>
                {!proOpen('hisobot', app) ? (
                  <ProLock title={proLabel('hisobot')}
                    caption="Har hafta: o'rtacha kaloriya, oldingi hafta bilan solishtirish va kunlar bo'yicha ustunlar."
                    onUnlock={()=>app.openTariffs('hisobot')}/>
                ) : week == null ? (
                  <Card>
                    <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{t('Hisobot uchun bu haftada kamida uch kunlik yozuv kerak.')}</span>
                  </Card>
                ) : (
                  <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:'var(--space-2)' }}>
                      <span style={{ font:'var(--type-ring)', fontSize:36, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>
                        {fmt(week.avgKcal)}
                      </span>
                      <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{t('kkal / kun')}</span>
                      {week.deltaKcal != null && (
                        <span style={{ marginLeft:'auto', font:'var(--type-caption)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>
                          {week.deltaKcal > 0 ? '+' : week.deltaKcal < 0 ? '\u2212' : ''}
                          {t1("{0} o'tgan haftaga nisbatan", fmt(Math.abs(week.deltaKcal)))}
                        </span>
                      )}
                    </div>
                    {/* Real per-day bars: an unlogged day is a gap, not a zero. */}
                    <div style={{ display:'flex', alignItems:'flex-end', gap:'var(--space-2)', height:88 }}>
                      {week.byDay.map(d=>{
                        const max = Math.max(GOALS.kcal, ...week.byDay.map(x=>x.kcal||0));
                        const h = d.kcal ? Math.max(4, Math.round((d.kcal/max)*72)) : 0;
                        return (
                          <span key={d.iso} style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', alignItems:'center', gap:'var(--space-1)' }}>
                            <span style={{ flex:1, width:'100%', display:'flex', alignItems:'flex-end' }}>
                              <span style={{
                                width:'100%', height:h||2, borderRadius:'var(--r-chip)',
                                background: d.kcal ? 'var(--aksent)' : 'var(--chegara)',
                              }}/>
                            </span>
                            <span style={{ font:'var(--type-badge)', color:'var(--matn-3)' }}>{weekdayOf(d.iso)}</span>
                          </span>
                        );
                      })}
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
                      {[
                        [t('Yozuv bor kunlar'), week.days + ' / 7'],
                        [t('Normaga mos kunlar'), week.withinGoal + ' / 7'],
                        [t("O'rtacha oqsil"), t1('{0} g', week.avgProtein)],
                      ].concat(week.avgScore != null ? [[t("O'rtacha Nutrition Score"), week.avgScore + ' / 100']] : [])
                       .map(([k,v])=>(
                        <span key={k} style={{ display:'flex', gap:'var(--space-3)', font:'var(--type-caption)' }}>
                          <span style={{ flex:1, minWidth:0, color:'var(--matn-2)' }}>{k}</span>
                          <span style={{ fontVariantNumeric:'tabular-nums' }}>{v}</span>
                        </span>
                      ))}
                    </div>
                  </Card>
                )}
              </Section>

              <ActionRow icon="list" title={t('Vazn tarixi')} caption={t1("{0} ta o'lchov", w.length)}
                onClick={()=>app.go('weight-history')}/>
            </>
          )}
        </div>
      </Scroll>
      <div style={{ position:'absolute', left:'var(--screen-gutter)', right:'var(--screen-gutter)', bottom:'var(--above-bottom-bar)' }}>
        <BottomBar value={app.tab} onChange={app.setTab} onAdd={app.openSheet}/>
      </div>
    </>
  );
}

// P2 — one record per day, today only. 5 kg jumps ask for confirmation but never block.
function WeightSheet({ app }) {
  const last = app.weights[app.weights.length-1];
  const todayExists = app.weights.some(x=>x.iso === app.todayIso);
  const [val,setVal] = React.useState(String(last.kg).replace('.', ','));
  const [confirm,setConfirm] = React.useState(false);
  const [saving,setSaving] = React.useState(false);
  const n = Number(String(val).replace(',', '.'));
  const bad = !val || isNaN(n) || n < 30 || n > 300;
  const jump = !bad && Math.abs(n - last.kg) > 5;

  const save = () => {
    if (jump && !confirm) { setConfirm(true); return; }
    setSaving(true);
    setTimeout(()=>{ setSaving(false); app.saveWeight(n); }, 500);
  };

  return (
    <BottomSheet open onClose={app.closeWeight}
      title={todayExists ? "Bugungi vaznni yangilash" : "Vazn qo'shish"}>
      <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
        <Input label={t('Vazn')} value={val} onChange={(v)=>{ setVal(v); setConfirm(false); }}
          unit={app.settings.vazn_birligi} numeric
          error={val && bad ? t("30\u2013300 kg oralig'ida bo'lsin") : undefined}
          warning={jump && !confirm
            ? t1("Oldingi o'lchovdan {0} kg farq qilyapti. To'g'rimi?", kg1(Math.abs(n-last.kg)))
            : undefined}/>
        <SettingRow title={t('Sana')} value={t1('{0} \u2014 bugun', sanaToliq(app.todayIso))} style={{ borderRadius:'var(--r-card)', border:'var(--hairline)', overflow:'hidden' }}/>
        {app.saveError && <ErrorState inline title={t('Saqlanmadi. Qayta urinish')} onRetry={save}/>}
        <Button variant="primary" full disabled={bad} loading={saving} onClick={save}>
          {jump && !confirm ? "Ha, to'g'ri" : 'Saqlash'}
        </Button>
      </div>
    </BottomSheet>
  );
}

// P3 — history; the onboarding record cannot be deleted.
function WeightHistoryScreen({ app }) {
  const [del,setDel] = React.useState(null);
  const list = weightPoints(app.weights).slice().reverse();
  return (
    <>
      <Scroll>
        <ScreenHeader onBack={()=>app.go('progress')} title={t('Vazn tarixi')}/>
        <div style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--card-gap)', paddingBottom:'var(--space-12)' }}>
          {list.map((m,i)=>{
            const prev = list[i+1];
            return (
              <Card key={m.id} style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
                <span style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:'var(--space-1)' }}>
                  <span style={{ font:'var(--type-card-title)', fontVariantNumeric:'tabular-nums' }}>
                    {t1('{0} \u2014 {1} kg', m.toliq, kg1(m.kg))}
                  </span>
                  <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>
                    {prev ? t1('{0} kg', delta(m.kg, prev.kg)) : t("boshlang'ich yozuv")}
                  </span>
                </span>
                <Button variant="tertiary" size="sm" onClick={()=>app.openWeight()}>{t('Tahrirlash')}</Button>
                {!m.onboarding && (
                  <Button variant="tertiary" size="sm" onClick={()=>setDel(m)}
                    style={{ color:'var(--xato)' }}>{t("O'chirish")}</Button>
                )}
              </Card>
            );
          })}
          <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
            Onboardingdagi birinchi yozuv o'chirilmaydi — u grafikning boshlang'ich nuqtasi.
          </span>
        </div>
      </Scroll>
      {del && (
        <BottomSheet open onClose={()=>setDel(null)} title="O'lchovni o'chirish">
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
            <span style={{ font:'var(--type-body)', color:'var(--matn-2)' }}>
              {t1("{0} \u00b7 {1} kg o'chiriladi. Kunlik norma qayta hisoblanadi.", del.toliq, kg1(del.kg))}
            </span>
            <Button variant="primary" full onClick={()=>{ app.removeWeight(del.id); setDel(null); }}>{t("O'chirish")}</Button>
            <Button variant="tertiary" full onClick={()=>setDel(null)}>{t('Bekor qilish')}</Button>
          </div>
        </BottomSheet>
      )}
    </>
  );
}

Object.assign(window, { ProgressScreen, WeightSheet, WeightHistoryScreen });
