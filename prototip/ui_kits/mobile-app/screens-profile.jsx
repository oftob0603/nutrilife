// F1 Profil (settings rows live here — there is no separate settings screen) ·
// F3 Shaxsiy ma'lumot · F4 Obuna · F5 Hisobni o'chirish.
// profil-tz: an expired PRO keeps history, journal and progress READABLE — only new AI
// scans and full recipe text close. Every screen that mentions expiry says so.

// The status line is built from the live scan counter, not a fixed string.
function roleCard(app) {
  const left = t1('{0} tadan {1} ta skan qoldi', app.scanLimit, app.scansLeft);
  if (app.proStatus === 'pro') return { text: t1('PRO \u00b7 {0} gacha faol', t('14-oktabr')), sub: left, cta: t('Obunani boshqarish') };
  if (app.proStatus === 'expired') return { text: t('PRO muddati tugadi \u00b7 tarix ochiq qoladi'), sub: left, cta: t('Yangilash') };
  return { text:t('Bepul reja'), sub: left, cta: 'PRO haqida' };
}

function ProfileScreen({ app }) {
  const role = app.proStatus;
  const card = roleCard(app);
  const p = app.profile;
  const s = app.settings;
  const loading = app.state === 'loading';
  const error = app.state === 'error';
  const [open,setOpen] = React.useState(null);
  // Unread admin replies, so the row itself carries the count even after the banner is gone.
  const [yordamOqilmagan,setYordamOqilmagan] = React.useState(()=>oqilmagan(MENING_ID));
  React.useEffect(()=>onSupportChange(()=>setYordamOqilmagan(oqilmagan(MENING_ID))), []);
  const [saving,setSaving] = React.useState(null);

  const pick = (key, value) => {
    setOpen(null); setSaving(key);
    setTimeout(()=>{ setSaving(null); if (!app.saveError) app.setSetting(key, value); }, 600);
  };

  return (
    <>
      {app.offline && <OfflineBar/>}
      <Scroll>
        <ScreenHeader title={t('Profil')}/>
        <div style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--block-gap)', paddingBottom:140 }}>
          {error ? (
            <ErrorState title={t("Profilni yuklab bo'lmadi")} onRetry={()=>app.setState('ready')}/>
          ) : loading ? (
            <>
              <Skeleton height={72} radius="var(--r-card)"/>
              <Skeleton height={104} radius="var(--r-card)"/>
              <Skeleton height={140} radius="var(--r-card)"/>
            </>
          ) : (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:'var(--space-4)' }}>
                <span style={{
                  width:56, height:56, flex:'0 0 auto', borderRadius:'50%',
                  background:'var(--chegara)', color:'var(--matn-2)',
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                  font:'var(--type-card-title)',
                }}>{p.ism.slice(0,1)}</span>
                <span style={{ display:'flex', flexDirection:'column', gap:'var(--space-1)' }}>
                  <span style={{ font:'var(--type-screen-title)', letterSpacing:'var(--ls-title)' }}>{p.ism}</span>
                  <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{t1('Ilovada {0} kun', p.kun)}</span>
                </span>
              </div>

              <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)', alignItems:'flex-start' }}>
                {role === 'pro'
                  ? <Badge tone="pro">{t('PRO')}</Badge>
                  : <Badge tone="pro" onClick={()=>app.openTariffs()}>{t('PRO')}</Badge>}
                <span style={{ font:'var(--type-card-title)' }}>{card.text}</span>
                <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>
                  {card.sub}
                </span>
                {role === 'expired' && (
                  <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
                    Jurnal, tarix va progress o'qish uchun ochiq. Faqat yangi AI skan va
                    retseptlarning to'liq matni yopildi.
                  </span>
                )}
                <Button variant={role === 'pro' ? 'secondary' : 'pro'} full
                  onClick={()=>role === 'pro' ? app.go('subscription') : app.openTariffs()}>{card.cta}</Button>
              </Card>

              <Section title={t('Qisqacha')}>
                <Card padded={false} style={{ overflow:'hidden' }}>
                  <SettingRow title={t('Asosiy maqsad')} value={t(p.maqsad)}/>
                  <SettingRow title={t('Joriy vazn')} value={t1('{0} kg', kg1(p.joriy_vazn))} style={{ borderTop:'var(--hairline)' }}/>
                  <SettingRow title={t('Maqsad vazn')} value={t1('{0} kg', p.maqsad_vazn)} style={{ borderTop:'var(--hairline)' }}/>
                  <SettingRow title={t('Kunlik norma')} value={t1('{0} kkal', fmt(p.norma))} style={{ borderTop:'var(--hairline)' }}/>
                </Card>
              </Section>

              <Card padded={false} style={{ overflow:'hidden' }}>
                {['til','mavzu','vazn_birligi','boy_birligi','energiya','bildirishnoma'].map((key,i)=>(
                  <SettingRow key={key} title={t(SETTING_LABEL[key])}
                    value={key === 'mavzu' && s.mavzu === 'Tizim'
                      ? t('Tizim') + ' \u00b7 ' + (app.dark ? t("Qorong'i").toLowerCase() : t("Yorug'").toLowerCase())
                      : key === 'til' ? s[key] : t(s[key])}
                    saving={saving===key} error={app.saveError && saving===null && key==='til'}
                    disabled={app.offline} onClick={()=>setOpen(key)}
                    style={i ? { borderTop:'var(--hairline)' } : undefined}/>
                ))}
                <SettingRow title={t("Shaxsiy ma'lumot")} onClick={()=>app.go('personal')} style={{ borderTop:'var(--hairline)' }}/>
              </Card>

              {app.offline && (
                <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
                  Internet yo'q. Sozlamalar o'qish uchun ochiq, o'zgartirish vaqtincha bloklangan.
                </span>
              )}
              <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
                {t("Birlik faqat ko'rsatish uchun \u2014 baza doim kg, sm va kkal da saqlaydi.")}
              </span>

              <Card padded={false} style={{ overflow:'hidden' }}>
                <SettingRow title={t('Yordam')} value={yordamOqilmagan ? String(yordamOqilmagan) : undefined}
                  onClick={()=>app.go('support')}/>
                <SettingRow title={t('Foydalanish shartlari')} onClick={()=>{}} style={{ borderTop:'var(--hairline)' }}/>
                <SettingRow title={t('Maxfiylik siyosati')} onClick={()=>{}} style={{ borderTop:'var(--hairline)' }}/>
              </Card>

              <Button variant="tertiary" full onClick={()=>app.go('delete-account')}
                style={{ color:'var(--xato)' }}>{t("Hisobni o'chirish")}</Button>
            </>
          )}
        </div>
      </Scroll>
      {open && (
        <BottomSheet open onClose={()=>setOpen(null)} title={t(SETTING_LABEL[open])}>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
            {SETTING_OPTIONS[open].map(o=>(
              /* The language list shows each language in ITS OWN name — «Русский» stays
                 «Русский» whatever the current language, the way language pickers work.
                 Every other list translates. */
              <OptionRow key={o} label={open === 'til' ? o : t(o)} selected={s[open]===o} onClick={()=>pick(open,o)}/>
            ))}
          </div>
        </BottomSheet>
      )}
      <div style={{ position:'absolute', left:'var(--screen-gutter)', right:'var(--screen-gutter)', bottom:'var(--above-bottom-bar)' }}>
        <BottomBar value={app.tab} onChange={app.setTab} onAdd={app.openSheet}/>
      </div>
    </>
  );
}

/* Option VALUES stay Uzbek in every one of these lists — they are identity, not display.
   They are compared (`s.mavzu === 'Tizim'`), persisted to localStorage, and fed back into
   the plan formula (`qiymat(GENDERS, profile.jins)`). An earlier mechanical pass wrapped
   some of them in `t()`, which in ru/en stored a translated value: the theme comparison
   stopped matching and the daily-target formula could no longer resolve the gender.
   Translation happens at RENDER — see `t(o)` on the OptionRow below. */
const SETTING_OPTIONS = {
  til: ["O'zbekcha", 'Русский', 'English'],
  mavzu: ["Yorug'", 'Qorong\u2019i', 'Tizim'],
  vazn_birligi: ['kg', 'lb'],
  boy_birligi: ['sm', 'ft'],
  energiya: ['kkal', 'kJ'],
  bildirishnoma: ["O'chirilgan", 'Kunlik eslatma', 'Faqat streak'],
};
const SETTING_LABEL = {
  til: 'Til', mavzu: 'Mavzu', vazn_birligi: 'Vazn birligi',
  boy_birligi: "Bo'y birligi", energiya: 'Energiya birligi',
  bildirishnoma: 'Bildirishnomalar',
};

// F3 — same validation as onboarding O4/O5. Fields that move the daily target ask first.
function PersonalScreen({ app }) {
  const p = app.profile;
  const [v,setV] = React.useState({
    ism:p.ism, jins:p.jins, yosh:String(p.yosh), boy:String(p.boy),
    maqsad:p.maqsad, faollik:p.faollik, maqsad_vazn:String(p.maqsad_vazn),
  });
  const [confirm,setConfirm] = React.useState(false);
  const set = (k)=>(val)=>setV(s=>({ ...s, [k]:val }));
  const yosh = Number(v.yosh), boy = Number(v.boy), mv = Number(v.maqsad_vazn);
  const badAge = !v.yosh || yosh < 18 || yosh > 100;
  const badH = !v.boy || boy < 120 || boy > 230;
  const wrongDir = v.maqsad === 'Vazn tashlash' && mv > p.joriy_vazn;
  const bad = !v.ism.trim() || badAge || badH || wrongDir;
  // jins · yosh · bo'y · maqsad · faollik all feed the formula.
  const affectsNorm =
    v.jins !== p.jins || yosh !== p.yosh || boy !== p.boy ||
    v.maqsad !== p.maqsad || v.faollik !== p.faollik;
  /* The new norm is COMPUTED from the edited values. It was `const yangiNorma = 2240` — a
     fixed number shown whatever the user changed, so a 30-year-old shortening their
     height and a 60-year-old switching to "very active" were both told "2,240". */
  const edited = { ...p, jins:v.jins, yosh, boy, maqsad:v.maqsad, faollik:v.faollik,
    maqsad_vazn: mv, joriy_vazn: p.joriy_vazn };
  const yangiPlan = planFromProfile(edited);
  const yangiNorma = yangiPlan ? yangiPlan.kcal : p.norma;
  // Nothing to confirm when the recomputed norm lands on the same number.
  const normaMoves = affectsNorm && yangiNorma !== p.norma;
  const saqla = () => { app.saveProfile(edited); setConfirm(false); app.go('profile'); };

  return (
    <>
      <Scroll>
        <ScreenHeader onBack={()=>app.go('profile')} title={t("Shaxsiy ma'lumot")}/>
        <div style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--block-gap)', paddingBottom:'var(--space-12)' }}>
          <Input label={t('Ism')} value={v.ism} onChange={set('ism')}/>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
            <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{t('Jins')}</span>
            <SegmentedControl value={v.jins} onChange={set('jins')}
              options={[{value:'Erkak',label:t('Erkak')},{value:'Ayol',label:t('Ayol')},{value:'Aytmayman',label:t('Aytmayman')}]}/>
          </div>
          <Input label={t('Yosh')} value={v.yosh} onChange={set('yosh')} unit="yosh" numeric
            error={v.yosh && badAge ? "Yosh 18–100 oralig'ida bo'lsin" : undefined}/>
          <Input label={t("Bo'y")} value={v.boy} onChange={set('boy')} unit={app.settings.boy_birligi} numeric
            error={v.boy && badH ? "Bo'y 120–230 sm oralig'ida bo'lsin" : undefined}/>

          <Section title={t('Maqsad')}>
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
              {['Vazn tashlash','Vaznni saqlash','Vazn oshirish',"Mushak yig'ish"].map(g=>(
                <OptionRow key={g} label={t(g)} selected={v.maqsad===g} onClick={()=>set('maqsad')(g)}/>
              ))}
            </div>
          </Section>

          <Input label={t('Maqsad vazn')} value={v.maqsad_vazn} onChange={set('maqsad_vazn')}
            unit={app.settings.vazn_birligi} numeric
            error={wrongDir ? t("Vazn tashlashni tanlagansiz, lekin maqsad vazn joriysidan katta") : undefined}/>

          <Section title={t('Faollik darajasi')}>
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
              {['Kam harakat','Yengil faol',"O'rtacha faol",'Juda faol'].map(a=>(
                <OptionRow key={a} label={t(a)} selected={v.faollik===a} onClick={()=>set('faollik')(a)}/>
              ))}
            </div>
          </Section>

          <Section title={t('Ovqat afzalliklari va odatlari')}>
            <Card padded={false} style={{ overflow:'hidden' }}>
              <SettingRow title={t('Afzalliklar')} value={p.afzalliklar.join(', ')} onClick={()=>{}}/>
              <SettingRow title={t('Odatlar')} value={p.odatlar} onClick={()=>{}} style={{ borderTop:'var(--hairline)' }}/>
            </Card>
            <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{t('Bu javoblar hozircha taom takliflari uchun saqlanadi.')}</span>
          </Section>

          <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
            <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
              Joriy vazn bu yerda o'zgartirilmaydi — u tarix yozuvi.
            </span>
            <Button variant="tertiary" full onClick={()=>{ app.setTab('progress'); app.openWeight(); }}>
              Progress bo'limida vazn qo'shish
            </Button>
          </Card>

          <Button variant="primary" full disabled={bad}
            onClick={()=>normaMoves ? setConfirm(true) : saqla()}>{t('Saqlash')}</Button>
        </div>
      </Scroll>
      {confirm && (
        <BottomSheet open onClose={()=>setConfirm(false)} title="Norma o'zgaradi">
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
            <span style={{ font:'var(--type-body)' }}>
              {t1("Kunlik normangiz {0} dan {1} ga o'zgaradi. Saqlansinmi?", fmt(p.norma), fmt(yangiNorma))}
            </span>
            <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
              O'tgan kunlar qayta hisoblanmaydi — har kun o'sha kundagi norma bilan qoladi.
            </span>
            <Button variant="primary" full onClick={saqla}>{t('Saqlash')}</Button>
            <Button variant="tertiary" full onClick={()=>setConfirm(false)}>{t('Bekor qilish')}</Button>
          </div>
        </BottomSheet>
      )}
    </>
  );
}

// F4 — cancelling only stops the next reminder; there is no recurring charge.
function SubscriptionScreen({ app }) {
  const [cancel,setCancel] = React.useState(false);
  const manual = app.manualPro;
  return (
    <>
      <Scroll>
        <ScreenHeader onBack={()=>app.go('profile')} title={t('Obuna')}/>
        <div style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--block-gap)', paddingBottom:'var(--space-12)' }}>
          <Card padded={false} style={{ overflow:'hidden' }}>
            <SettingRow title={t('Holat')} value="Faol"/>
            <SettingRow title={t('Tarif')} value="Oylik" style={{ borderTop:'var(--hairline)' }}/>
            <SettingRow title={t('Boshlangan')} value="14.09.2026" style={{ borderTop:'var(--hairline)' }}/>
            <SettingRow title={t('Tugaydi')} value="14.10.2026" style={{ borderTop:'var(--hairline)' }}/>
            {manual && <SettingRow title={t('Manba')} value={t('Administrator tomonidan berilgan')} style={{ borderTop:'var(--hairline)' }}/>}
          </Card>

          <Section title="To'lovlar tarixi">
            {manual ? (
              <Card>
                <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
                  Administrator tomonidan berilgan obuna — to'lov yozuvi yo'q.
                </span>
              </Card>
            ) : (
              <Card padded={false} style={{ overflow:'hidden' }}>
                {USER_PAYMENTS.map((pay,i)=>(
                  <span key={pay.id} style={{
                    display:'flex', alignItems:'center', gap:'var(--space-3)',
                    padding:'var(--space-3) var(--space-4)',
                    borderTop: i ? 'var(--hairline)' : undefined,
                  }}>
                    <span style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:'var(--space-1)' }}>
                      <span style={{ font:'var(--type-body)', fontVariantNumeric:'tabular-nums' }}>{pay.summa}</span>
                      <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>
                        {pay.sana} · {t.usul}
                      </span>
                    </span>
                    <Badge tone="neutral">{pay.holat}</Badge>
                  </span>
                ))}
              </Card>
            )}
          </Section>

          <Button variant="secondary" full onClick={()=>setCancel(true)}
            style={{ color:'var(--xato)' }}>{t('Obunani bekor qilish')}</Button>
          <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
            Avtomatik takroriy to'lov yo'q — bekor qilish keyingi eslatmani o'chiradi.
          </span>
        </div>
      </Scroll>
      {cancel && (
        <BottomSheet open onClose={()=>setCancel(false)} title={t('Obunani bekor qilish')}>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
            <span style={{ font:'var(--type-body)' }}>
              PRO 14-oktabrgacha ishlaydi. To'langan pul qaytarilmaydi. Muddat tugagach
              tarix va jurnal ochiq qoladi, yangi skan va retsept matni yopiladi.
            </span>
            <Button variant="primary" full onClick={()=>{ setCancel(false); app.go('profile'); }}>{t('Tasdiqlash')}</Button>
            <Button variant="tertiary" full onClick={()=>setCancel(false)}>{t('Bekor qilish')}</Button>
          </div>
        </BottomSheet>
      )}
    </>
  );
}

// F5 — two steps: what disappears, then the typed word.
function DeleteAccountScreen({ app }) {
  const [step,setStep] = React.useState(1);
  const [typed,setTyped] = React.useState('');
  const WORD = "O'CHIRISH";

  if (step === 1) return (
    <Scroll>
      <ScreenHeader onBack={()=>app.go('profile')} title={t("Hisobni o'chirish")}/>
      <div style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--block-gap)', paddingBottom:'var(--space-12)' }}>
        <span style={{ font:'var(--type-body)' }}>Quyidagilar butunlay o'chadi:</span>
        <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
          {["Profil va shaxsiy ma'lumot","Butun ovqat jurnali","Barcha rasmlar","Vazn tarixi"].map(item=>(
            <span key={item} style={{ display:'flex', gap:'var(--space-3)', font:'var(--type-body)' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--matn-3)', flex:'0 0 auto', marginTop:9 }}/>
              <span style={{ flex:1, minWidth:0 }}>{t(item)}</span>
            </span>
          ))}
        </Card>
        <Note tone="warn" title="Bu amalni qaytarib bo'lmaydi">
          {app.role === 'pro'
            ? "PRO obunangiz tugaydi, pul qaytarilmaydi."
            : "O'chirilgan ma'lumotni tiklash imkoni yo'q."}
        </Note>
        <Button variant="primary" full onClick={()=>setStep(2)}>{t('Davom etish')}</Button>
        <Button variant="tertiary" full onClick={()=>app.go('profile')}>{t('Bekor qilish')}</Button>
      </div>
    </Scroll>
  );

  return (
    <Scroll>
      <ScreenHeader onBack={()=>setStep(1)} title={t('Tasdiqlash')}/>
      <div style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column', gap:'var(--block-gap)', paddingBottom:'var(--space-12)' }}>
        <Input label={'Tasdiqlash uchun «' + WORD + '» deb yozing'} value={typed} onChange={setTyped}/>
        <Button variant="primary" full disabled={typed.trim() !== WORD}
          onClick={()=>app.go('profile')}>{t("Hisobni o'chirish")}</Button>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
          O'chirilgach Telegramga qaytariladi va bot orqali bitta xabar yuboriladi.
        </span>
      </div>
    </Scroll>
  );
}

/* F6 — Yordam. A direct conversation with the admin, not a form or a mailto: the user
   writes here and an admin answers from the panel's «So'rovlar» section. Both read the one
   store in ../shared/support.js, keyed by user id, so the thread belongs to this person
   and its history is the record on both sides.

   Deliberately plain: no status, no ticket number, no «typical reply time». The user's
   side of a support thread is just the messages. */
function SupportScreen({ app }) {
  const [thread,setThread] = React.useState(()=>sorov(MENING_ID));
  const [draft,setDraft] = React.useState('');
  const [padBottom,setPadBottom] = React.useState(96);
  const composer = React.useRef(null);
  const content = React.useRef(null);

  // An admin reply written in the panel appears here without a refresh, and opening the
  // screen (or receiving one while it is open) marks the thread seen.
  React.useEffect(()=>onSupportChange(()=>{ setThread(sorov(MENING_ID)); belgilashKorildi(MENING_ID); }), []);
  React.useEffect(()=>{ belgilashKorildi(MENING_ID); }, []);

  /* Clearance is MEASURED from the composer, not written as a spacing token: a fixed
     value silently drifts the moment the composer's own padding or control height
     changes, and the cost of drifting is that the newest message hides under it with no
     way to scroll it out. */
  React.useEffect(()=>{
    const fit = () => { if (composer.current) setPadBottom(composer.current.offsetHeight + 12); };
    fit();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    if (ro && composer.current) ro.observe(composer.current);
    return () => ro && ro.disconnect();
  }, []);

  // A chat opens on its newest turn, not its oldest — on mount, and after every new
  // message from either side. `Scroll` does not forward a ref, so the scroller is reached
  // through the content column's parent, the same way RequestChat does it.
  React.useEffect(()=>{
    const el = content.current && content.current.parentElement;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread.xabarlar.length, padBottom]);

  const send = () => {
    const msg = draft.trim();
    if (!msg || app.offline) return;
    xabarQoshish(MENING_ID, 'user', msg);
    setThread(sorov(MENING_ID));
    setDraft('');
  };

  const bosh = thread.xabarlar.length === 0;

  return (
    <>
      <Scroll>
        <ScreenHeader onBack={()=>app.go('profile')} title={t('Yordam')}/>
        <div ref={content} style={{ padding:'0 var(--screen-gutter)', display:'flex', flexDirection:'column',
          gap:'var(--card-gap)', paddingBottom:padBottom }}>
          {bosh ? (
            <Card>
              <span style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
                <span style={{ font:'var(--type-card-title)' }}>{t('Savolingiz bormi?')}</span>
                <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{t('Yozib qoldiring — admin shu yerda javob beradi.')}</span>
              </span>
            </Card>
          ) : thread.xabarlar.map((m,i)=>{
            const mine = m.kim === 'user';
            return (
              <span key={i} style={{ display:'flex', flexDirection:'column', gap:2,
                alignItems: mine ? 'flex-end' : 'flex-start' }}>
                <span style={{
                  maxWidth:'82%', padding:'var(--space-3)', borderRadius:'var(--r-card)',
                  background: mine ? 'var(--aksent)' : 'var(--karta)',
                  color: mine ? 'var(--aksent-matn)' : 'var(--siyoh)',
                  border: mine ? 'none' : 'var(--hairline)', font:'var(--type-body)',
                }}>{m.matn}</span>
                <span style={{ font:'var(--type-badge)', color:'var(--matn-3)', fontVariantNumeric:'tabular-nums' }}>
                  {(mine ? t('Siz') : t('Admin')) + ' · ' + m.vaqt}
                </span>
              </span>
            );
          })}
        </div>
      </Scroll>
      {/* Composer shaped after the reference: ONE pill holding a leading glyph, the text
         itself, and a round send button at the right edge — not a bordered field with a
         labelled button beside it. Colours stay NutriLife's, so the send button is accent
         with on-accent ink rather than Telegram blue.

         A textarea, not an input: it grows to a second line as the message gets longer,
         and the measured clearance above follows it. */}
      <div ref={composer} style={{ position:'absolute', left:0, right:0, bottom:0,
        padding:'var(--space-3) var(--screen-gutter)', background:'var(--fon)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)',
          background:'var(--karta)', border:'var(--hairline)', borderRadius:'var(--r-pill)',
          padding:'6px 6px 6px var(--space-3)', minWidth:0,
          opacity: app.offline ? 0.5 : 1 }}>
          <Icon name="smile" size={22} color="var(--matn-2)"/>
          <textarea rows={1} value={draft} disabled={app.offline}
            onChange={(e)=>setDraft(e.target.value)}
            onKeyDown={(e)=>{ if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={app.offline ? 'Internet yo\u2019q' : 'Xabar'}
            style={{ flex:1, minWidth:0, resize:'none', border:0, outline:'none', padding:0,
              background:'transparent', color:'var(--siyoh)', font:'var(--type-body)',
              maxHeight:72, lineHeight:1.35 }}/>
          <button type="button" onClick={send} disabled={!draft.trim() || app.offline}
            aria-label={t('Yuborish')} style={{
              flex:'0 0 auto', width:40, height:40, borderRadius:'var(--r-pill)', border:0,
              display:'grid', placeItems:'center', cursor:'pointer',
              background: draft.trim() ? 'var(--aksent)' : 'var(--fon)',
              opacity: draft.trim() ? 1 : 0.6,
              transition:'background var(--tez) var(--ease), opacity var(--tez) var(--ease)',
            }}>
            <Icon name="send" size={18} color={draft.trim() ? 'var(--aksent-matn)' : 'var(--matn-3)'}/>
          </button>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { ProfileScreen, PersonalScreen, SubscriptionScreen, DeleteAccountScreen, SupportScreen });
