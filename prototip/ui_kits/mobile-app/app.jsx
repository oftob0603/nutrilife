// `embedded` is the prototype shell: it supplies the whole-journey chrome, so the kit
// drops its own scaffolding panel and hands PRO navigation back to the shell instead of
// leaving the page. Standalone (no props) behaves exactly as before.
function NutriLifeApp({ embedded = false, onTariffs = null, onReset = null }) {
  const [screen,setScreen] = React.useState('home');
  const [from,setFrom] = React.useState('home');
  const [tab,setTab] = React.useState('home');
  const [sheet,setSheet] = React.useState(false);
  const [entries,setEntries] = React.useState(START_ENTRIES);
  const [food,setFood] = React.useState(null);
  const [draft,setDraft] = React.useState(null);
  const [state,setState] = React.useState('ready');
  const [offline,setOffline] = React.useState(false);
  const [aiFails,setAiFails] = React.useState(false);
  // ONE subscription state for the whole app: 'free' | 'pro' | 'expired'.
  // Seeded from localStorage so a purchase made on the paywall page is already in
  // effect when the user lands back here.
  const [proStatus,setProStatus] = React.useState(() => readProStatus() || 'free');
  // Real AI-scan counter. The allowance comes from the plan: 3 free, 20 PRO.
  const [scansToday,setScansToday] = React.useState(0);
  // Favourite recipes, persisted. Ids only — the recipe bodies stay in the store.
  const [favourites,setFavourites] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('nutrilife.favourites') || '[]'); }
    catch (e) { return []; }
  });
  const [recipeId,setRecipeId] = React.useState(null);
  // The recipes table the admin panel writes to — never a local sample list.
  // ui_kits/shared/recipes.js is a required prerequisite script; resolved defensively
  // because that plain file is not part of the compiled design-system bundle.
  const [recipes] = React.useState(
    () => (typeof RECIPE_DB !== 'undefined' ? RECIPE_DB : (typeof window !== 'undefined' && window.RECIPE_DB) || [])
  );
  const [weights,setWeights] = React.useState(WEIGHTS);
  const [weightSheet,setWeightSheet] = React.useState(false);
  const [saveError,setSaveError] = React.useState(false);
  const [normaToast,setNormaToast] = React.useState(null);
  // Persisted so the choice survives a reload; only this key is ever touched.
  const [settings,setSettings] = React.useState(() => {
    try {
      const saved = localStorage.getItem('nutrilife.settings');
      return saved ? { ...SETTINGS, ...JSON.parse(saved) } : SETTINGS;
    } catch (e) { return SETTINGS; }
  });
  /* The persisted language has to reach i18n before the first paint, otherwise a reload
     renders one frame of Uzbek before switching. Set during render rather than in an
     effect for that reason. */
  if (typeof tilniOrnat === 'function') tilniOrnat(settings.til);
  // 'Tizim' means keep listening — not "read the device once at startup".
  const [systemDark,setSystemDark] = React.useState(
    () => typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
  );
  React.useEffect(() => {
    if (typeof matchMedia !== 'function') return undefined;
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  const dark = settings.mavzu === 'Qorong\u2019i'
    || (settings.mavzu === 'Tizim' && systemDark);
  React.useEffect(() => {
    const sync = () => { const s = readProStatus(); if (s) setProStatus(s); };
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);
  const [manualPro,setManualPro] = React.useState(false);
  const todayIso = '2026-09-15';
  // Demo bonus for the states panel's "Streak +1" button. The real streak is derived
  // from the journal; this only adds to it, so the panel cannot desynchronise the count.
  // Bumped whenever PROFILE/GOALS are recomputed in place, so the screens that read
  // those module globals re-render. Mutation alone cannot trigger React.
  const [profileVersion,setProfileVersion] = React.useState(0);
  const [streakBonus,setStreakBonus] = React.useState(0);
  const [streakGrew,setStreakGrew] = React.useState(false);

  const go = (s) => { setSheet(false); setScreen(s); };
  const goTab = (tab) => { setTab(tab); go(tab === 'home' ? 'home' : tab); };

  const app = {
    entries, food, draft, state, setState, offline, tab, from, aiFails,
    recipes, recipeId,
    weights, settings, manualPro, saveError, todayIso,
    /* The profile the screens read. `joriy_vazn` and `norma` are DERIVED, not stored:
       the current weight IS the last record in the weight log, and the daily norm IS
       GOALS.kcal. They used to be separate fields on PROFILE, which meant that after
       recording a new weight the profile still displayed the old one and the old norm. */
    profile: {
      ...PROFILE,
      joriy_vazn: weights.length ? weights[weights.length-1].kg : PROFILE.maqsad_vazn,
      norma: GOALS.kcal,
      v: profileVersion,
    },
    /* Streak from the LIVE journal, so logging today's first entry extends it. STREAK is
       computed at module load from the seeded history alone, which does not include the
       entries the user adds in this session. `streakBump` stays a separate flag for the
       animation — it must fire on an increase, never on a render. */
    streak: streakOf(historyWith(todayIso, entries), streakBonus), streakGrew,
    // --- subscription ---
    proStatus,
    // `role` is kept as a read-only alias so profile code reads one value, not two.
    role: proStatus,
    scansToday, favourites,
    scanLimit: scanLimit(proStatus),
    scansLeft: Math.max(0, scanLimit(proStatus) - scansToday),
    limitSpent: scansToday >= scanLimit(proStatus),
    setProStatus: (s) => { writeProStatus(s); setProStatus(s); },
    // Every AI scan spends one. Returns false when the allowance is gone, so the
    // caller routes to the paywall instead of starting an analysis it cannot finish.
    useScan: () => {
      if (scansToday >= scanLimit(proStatus)) return false;
      setScansToday((n) => n + 1);
      return true;
    },
    toggleFavourite: (id) => setFavourites((list) => {
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      try { localStorage.setItem('nutrilife.favourites', JSON.stringify(next)); } catch (e) {}
      return next;
    }),
    isFavourite: (id) => favourites.includes(id),
    history: historyWith(todayIso, entries),
    // Demo hook: the bump is tied to a real increase, never to a render.
    growStreak: () => {
      setStreakBonus(n => n + 1);
      setStreakGrew(true);
      setTimeout(()=>setStreakGrew(false), 400);
    },
    openWeight: () => setWeightSheet(true),
    closeWeight: () => setWeightSheet(false),
    saveWeight: (kg) => {
      const next = (() => {
        const i = weights.findIndex(x => x.iso === todayIso);
        if (i >= 0) return weights.map((x,j) => j===i ? { ...x, kg } : x);
        return [...weights, { id:Date.now(), iso:todayIso, kg }];
      })();
      setWeights(next);
      setWeightSheet(false);
      /* Recording a weight really does recompute the daily target (onboarding-tz §5):
         body weight is a term in Mifflin-St Jeor, so the norm cannot stay put while the
         weight moves. This previously showed a FIXED string ("2,190 → 2,150") and changed
         nothing — the number was the same whatever the user typed, and GOALS never moved,
         so the ring, the macro bars, Nutrition Score and the statistics all kept scoring
         against the old target.

         GOALS is mutated rather than replaced because every screen reads it as a module
         global; the toast is built from the real before/after values, and is skipped when
         the recomputation does not actually move the number. */
      const oldKcal = GOALS.kcal;
      const plan = planFromProfile({ ...PROFILE, joriy_vazn: kg }, kg);
      if (!plan) return;
      const m = macrosOf(plan);
      Object.assign(GOALS, { kcal: plan.kcal, p: m.p || GOALS.p, fat: m.fat || GOALS.fat, c: m.c || GOALS.c });
      if (plan.kcal !== oldKcal) {
        setNormaToast('Kunlik normangiz yangilandi: ' + fmt(oldKcal) + ' \u2192 ' + fmt(plan.kcal));
        setTimeout(()=>setNormaToast(null), 3200);
      }
    },
    removeWeight: (id) => setWeights(l => l.filter(x => x.id !== id)),
    dark, systemDark,
    setSetting: (k,v) => setSettings(s => {
      const next = { ...s, [k]:v };
      /* Language applies immediately and everywhere: i18n holds the active language
         outside React (so `t()` is callable from anything, not only a hook), so it is set
         BEFORE the state update that re-renders the tree. The stored shape is unchanged —
         still the label the row displays — so already-saved choices keep working. */
      if (k === 'til' && typeof tilniOrnat === 'function') tilniOrnat(v);
      try { localStorage.setItem('nutrilife.settings', JSON.stringify(next)); } catch (e) {}
      return next;
    }),
    /* Saving personal info was MISSING: F3's Saqlash button only navigated away, so a
       changed age, height, gender, goal or activity level was discarded and the daily
       target never moved — while the confirmation sheet told the user it had. The edits
       are written onto PROFILE (a module global the screens read) and the target is
       recomputed from them, so profile → goals → calorie target → macros → Home is one
       chain rather than three disconnected screens. */
    saveProfile: (patch) => {
      /* The derived keys are STRIPPED before storing. `patch` comes from the F3 screen,
         which spreads `app.profile` — the derived object below, carrying `norma`,
         `joriy_vazn` and the render counter `v`. Assigning it wholesale wrote all three
         back onto canonical PROFILE as second copies, and `norma` was stale the instant
         GOALS moved. Only the fields PROFILE actually owns are stored; the weight rides
         along to seed the recomputation, since PROFILE deliberately does not keep it. */
      const { norma, joriy_vazn, v, ...store } = patch;
      Object.assign(PROFILE, store);
      const plan = planFromProfile(PROFILE, joriy_vazn != null ? joriy_vazn : (weights.length ? weights[weights.length-1].kg : null));
      if (plan) {
        const m = macrosOf(plan);
        Object.assign(GOALS, { kcal: plan.kcal, p: m.p || GOALS.p, fat: m.fat || GOALS.fat, c: m.c || GOALS.c });
      }
      // PROFILE/GOALS are plain objects, so a render has to be requested explicitly.
      setProfileVersion(n => n + 1);
    },
    setTab: goTab,
    go,
    // A FREE user tapping a PRO recipe lands on the paywall, not the details.
    openRecipe: (id) => {
      const rec = recipes.find(x=>x.id===id);
      setRecipeId(id);
      go(rec && rec.pro && !proOpen('retsept', { proStatus }) ? 'recipePaywall' : 'recipe');
    },
    // THE single PRO entry point. Every PRO badge, lock and gated row calls this —
    // never its own navigation — so all of them land in the same place.
    // A subscriber is passed through to the feature instead of being sold to.
    openTariffs: (featureId) => {
      if (featureId && proOpen(featureId, { proStatus })) return;
      if (proStatus === 'pro') { setTab('profile'); go('subscription'); return; }
      // Straight to the plan picker — there is no intermediate benefits screen.
      // In the shell the paywall is a screen in the same session; standalone it is a page.
      if (onTariffs) { onTariffs(featureId || 'profile'); return; }
      window.location.href = '../paywall/index.html?from=' + (featureId || 'profile');
    },
    openSheet: () => setSheet(true),
    openFood: (f) => { setFood(f); go('detail'); },
    // A scan is only started if the allowance covers it.
    analyze: () => {
      if (scansToday >= scanLimit(proStatus)) { app.openTariffs('skan'); return; }
      setScansToday((n) => n + 1);
      go('analyzing');
    },
    commit: (e) => {
      const time = new Date().toTimeString().slice(0,5);
      setEntries((list)=>[...list, { ...e, id:Date.now(), time }]);
      go('added');
    },
    editEntry: (e) => { setDraft(e); setFrom(screen); go('edit'); },
    saveEdit: (e) => { setEntries((l)=>l.map(x=>x.id===e.id?e:x)); go(from); },
    duplicate: (e) => { setEntries((l)=>[...l,{ ...e, id:Date.now() }]); go('added'); },
    remove: (e) => { setEntries((l)=>l.filter(x=>x.id!==e.id)); go(from); },
  };

  /* Support notification. The admin's reply is written from the panel, so the app learns
     about it through the store's change event rather than by polling — which is what makes
     it fire reliably on every reply, including several in a row (the unread COUNT grows;
     a flag would collapse them).

     The banner is suppressed while the chat itself is open: a notification for a message
     you are looking at is noise, and the thread is marked seen instead. `screenRef` keeps
     the listener from closing over a stale screen value. */
  const [notif,setNotif] = React.useState(null);
  const screenRef = React.useRef(screen);
  screenRef.current = screen;

  React.useEffect(()=>{
    const check = () => {
      if (screenRef.current === 'support') {
        belgilashKorildi(MENING_ID);
        setNotif(null);
        return;
      }
      const n = oqilmagan(MENING_ID);
      setNotif(n > 0 ? { n, last: oqilmaganOxirgi(MENING_ID) } : null);
    };
    check();
    return onSupportChange(check);
  }, []);

  // Opening the chat by any route clears it, not just tapping the banner.
  React.useEffect(()=>{
    if (screen === 'support') { belgilashKorildi(MENING_ID); setNotif(null); }
  }, [screen]);

  const body =
    screen === 'home' ? <HomeScreen app={app}/> :
    screen === 'journal' ? <JournalScreen app={app}/> :
    screen === 'recipes' ? <RecipesScreen app={app}/> :
    screen === 'recipe' ? <RecipeScreen app={app}/> :
    screen === 'recipePaywall' ? <RecipePaywallScreen app={app}/> :

    screen === 'progress' ? <ProgressScreen app={app}/> :
    screen === 'weight-history' ? <WeightHistoryScreen app={app}/> :
    screen === 'profile' ? <ProfileScreen app={app}/> :
    screen === 'personal' ? <PersonalScreen app={app}/> :
    screen === 'support' ? <SupportScreen app={app}/> :
    screen === 'subscription' ? <SubscriptionScreen app={app}/> :
    screen === 'delete-account' ? <DeleteAccountScreen app={app}/> :
    screen === 'camera' ? <CameraScreen app={app}/> :
    screen === 'search' ? <SearchScreen app={app}/> :
    screen === 'detail' ? <FoodScreen app={app}/> :
    screen === 'analyzing' ? <AnalyzingScreen app={app}/> :
    screen === 'ai-error' ? <AiErrorScreen app={app}/> :
    screen === 'result' ? <ResultScreen app={app}/> :
    screen === 'result-blank' ? <ResultScreen app={app} blank/> :
    screen === 'added' ? <AddedScreen app={app}/> :
    screen === 'edit' ? <EditScreen app={app}/> : null;

  return (
    <div style={{ display:'flex', gap:32, alignItems:'flex-start', flexWrap:'wrap' }}>
      <Phone dark={dark}>
        {/* One fade for every section. Opacity only — a transform here would become the
            containing block for the scroll surfaces and drag content against the scroll. */}
        <div key={screen} style={{
          position:'absolute', inset:0, display:'flex', flexDirection:'column',
          animation:'nutrilife-nav var(--nav-duration) var(--ease-nav) both',
        }}>{body}</div>
        {notif && screen !== 'support' && (
          <button type="button" onClick={()=>{ setTab('profile'); go('support'); }}
            style={{
              position:'absolute', left:'var(--screen-gutter)', right:'var(--screen-gutter)', top:52, zIndex:40,
              display:'flex', alignItems:'center', gap:'var(--space-3)', textAlign:'left',
              background:'var(--karta)', border:'var(--hairline)', borderRadius:'var(--r-card)',
              boxShadow:'var(--shadow-float)', padding:'var(--space-3)', cursor:'pointer',
              animation:'nutrilife-nav var(--nav-duration) var(--ease-nav) both',
            }}>
            <span style={{ flex:'0 0 auto', width:36, height:36, borderRadius:'var(--r-pill)',
              background:'var(--aksent)', display:'grid', placeItems:'center' }}>
              <Icon name="message-square" size={18} color="var(--aksent-matn)"/>
            </span>
            <span style={{ display:'flex', flexDirection:'column', gap:2, flex:1, minWidth:0 }}>
              <span style={{ font:'var(--type-card-title)' }}>
                {notif.n > 1 ? 'Admin ' + notif.n + ' xabar yubordi' : 'Admin javob berdi'}
              </span>
              <span style={{ font:'var(--type-caption)', color:'var(--matn-2)',
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {notif.last ? notif.last.matn : ''}
              </span>
            </span>
            <Icon name="chevron-right" size={18} color="var(--matn-3)"/>
          </button>
        )}
        {weightSheet && <WeightSheet app={app}/>}
        {normaToast && (
          <div style={{
            position:'absolute', left:'var(--screen-gutter)', right:'var(--screen-gutter)', bottom:120, zIndex:30,
            background:'var(--siyoh)', color:'var(--on-siyoh)', borderRadius:'var(--r-card)',
            padding:'var(--space-3) var(--space-4)', font:'var(--type-caption)',
            fontVariantNumeric:'tabular-nums',
          }}>{normaToast}</div>
        )}
        <BottomSheet open={sheet} onClose={()=>setSheet(false)} title="Ovqat qo'shish">
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
            <ActionRow icon="camera" title={t('Kamera')} caption={t('Ovqatni rasmga oling')}
              disabled={app.limitSpent} onClick={()=>app.limitSpent ? app.openTariffs('skan') : go('camera')}
              trailing={<Icon name="chevron-right" size={20} color="var(--matn-3)"/>}/>
            <ActionRow icon="image" title={t('Galereya')} caption={t('Tayyor rasmni tanlang')}
              disabled={app.limitSpent} onClick={()=>app.analyze()}/>
            <ActionRow icon="pencil" title={t("Qo'lda qo'shish")} caption={t("Taom bazasidan tanlang \u2014 cheklovsiz")}
              onClick={()=>go('search')}/>
            {app.limitSpent ? (
              <div style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
                {proStatus === 'pro'
                  ? 'Bugungi ' + app.scanLimit + ' ta skan ishlatildi. Ertaga yangilanadi — qo\'lda qo\'shish cheklovsiz.'
                  : null}
                {proStatus !== 'pro' && <>
                  Bepul skanlar tugadi. Qo'lda qo'shish cheklovsiz.{' '}
                  <a href="#pro" onClick={(e)=>{ e.preventDefault(); app.openTariffs('skan'); }}>{t('PRO haqida')}</a>
                </>}
              </div>
            ) : (
              <div style={{ font:'var(--type-caption)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>
                {t1('{0} tadan {1} ta skan qoldi', app.scanLimit, app.scansLeft)}
              </div>
            )}
            <Button variant="tertiary" full onClick={()=>setSheet(false)}>{t('Bekor qilish')}</Button>
          </div>
        </BottomSheet>
      </Phone>

      {!embedded && <aside style={{
        width:260, flex:'0 0 auto', background:'var(--karta)', border:'var(--hairline)',
        borderRadius:'var(--r-card)', padding:'var(--card-padding)',
        display:'flex', flexDirection:'column', gap:'var(--space-3)',
      }}>
        <div style={{ font:'var(--type-card-title)' }}>{t('Holatlar')}</div>
        <div style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
          {t("Prototip holatlarini shu yerdan almashtiring \u2014 kitning o'zida bu panel yo'q. Obuna holati bitta: FREE / PRO / muddati tugagan. To'qqizta PRO imkoniyati shu bittasiga bog'langan.")}
        </div>
        {[
          ['Home — yuklanmoqda', state==='loading', ()=>setState(state==='loading'?'ready':'loading')],
          ['Home — xato', state==='error', ()=>setState(state==='error'?'ready':'error')],
          ['Jurnal bo\'sh', entries.length===0, ()=>setEntries(entries.length?[]:START_ENTRIES)],
          ['Oflayn chizig\'i', offline, ()=>setOffline(!offline)],
          [t('Skan limiti tugagan'), app.limitSpent, ()=>setScansToday(app.limitSpent ? 0 : scanLimit(proStatus))],
          [t('AI tanimaydi'), aiFails, ()=>setAiFails(!aiFails)],
          ['Obuna: FREE', proStatus==='free', ()=>app.setProStatus('free')],
          ['Obuna: PRO', proStatus==='pro', ()=>app.setProStatus('pro')],
          ['Obuna: muddati tugagan', proStatus==='expired', ()=>app.setProStatus('expired')],
          ['Obuna admin bergan', manualPro, ()=>setManualPro(!manualPro)],
          [t('Saqlash xatosi'), saveError, ()=>setSaveError(!saveError)],
          ['Streak +1', streakGrew, ()=>app.growStreak()],
          ['Qurilma: tungi rejim', systemDark, ()=>setSystemDark(v=>!v)],
          ['Vazn: bitta nuqta', weights.length===1, ()=>setWeights(weights.length===1?WEIGHTS:[WEIGHTS[0]])],
        ].map(([label,on,fn])=>(
          <button key={label} type="button" onClick={fn} style={{
            display:'flex', alignItems:'center', justifyContent:'space-between', gap:'var(--space-2)',
            minHeight:'var(--hit-min)', padding:'0 var(--space-3)', cursor:'pointer',
            background:on?'var(--siyoh)':'transparent', color:on?'var(--on-siyoh)':'var(--siyoh)',
            border:on?'1px solid var(--siyoh)':'var(--hairline)', borderRadius:'var(--r-chip)',
            font:'var(--type-caption)', textAlign:'left',
          }}>{t(label)}<span>{on?t('yoniq'):t("o'chiq")}</span></button>
        ))}
        <div style={{ height:1, background:'var(--chegara)' }}/>
        <div style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{t('Ekranlar')}</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'var(--space-2)' }}>
          {[['E1','home'],['E2','home'],['E3','camera'],['E4','search'],['E5','detail'],['E6','analyzing'],['E7','result'],['E8','added'],['E9','journal'],['E10','edit'],['R1','recipes'],['R2','recipe'],['R3','recipePaywall'],
            ['P1','progress'],['P2','progress'],['P3','weight-history'],
            ['F1','profile'],['F3','personal'],['F4','subscription'],['F5','delete-account'],['F6','support'],
].map(([k,s],i)=>(
            <Chip key={i} selected={screen===s} onClick={()=>{
              if (s==='detail') { setFood(FOODS[0]); }
              if (s==='edit') { setDraft(entries[0]||START_ENTRIES[0]); }
              if (s==='recipes') { setTab('recipes'); }
              if (s==='recipe' || s==='recipePaywall') {
                setTab('recipes');
                const first = recipes.filter(x=>x.holat==='Chop etilgan')[0];
                if (first) setRecipeId(first.id);
              }
              if (k==='E2') { setScreen('home'); setSheet(true); return; }
              if (k==='P2') { setTab('progress'); setScreen('progress'); setWeightSheet(true); return; }
              if (s==='progress' || s==='weight-history') setTab('progress');
              if (['profile','personal','subscription','delete-account','support'].includes(s)) setTab('profile');
              go(s);
            }} style={{ minHeight:36, padding:'0 var(--space-3)' }}>{k}</Chip>
          ))}
        </div>
      </aside>}
    </div>
  );
}

Object.assign(window, { NutriLifeApp });
