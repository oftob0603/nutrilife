function PaywallApp() {
  const [screen,setScreen] = React.useState('tariffs');
  const [source,setSource] = React.useState(() => {
    const from = new URLSearchParams(location.search).get('from');
    // Map a PRO feature id to the header case that explains the arrival.
    if (from === 'skan') return 'limit';
    if (from === 'retsept') return 'recipe';
    if (from) return 'profile';
    return 'onboarding';
  });
  const [state,setState] = React.useState('ready');
  const [dark,setDark] = React.useState(false);
  // "Yillik" is pre-selected on mount, and survives the trip to screen 2 and back.
  const [selected,setSelected] = React.useState('yillik');
  const [closed,setClosed] = React.useState(false);
  const [paid,setPaid] = React.useState(false);
  const plan = PLANS.find(p => p.id === selected) || PLANS[0];

  return (
    <div className="flex flex-wrap items-start gap-8 justify-center sm:justify-start">
      <div data-theme={dark ? 'dark' : undefined}
        className="flex h-[844px] w-full max-w-[390px] shrink-0 flex-col overflow-hidden bg-[var(--page)] text-[var(--ink)] sm:rounded-[44px] sm:border sm:border-[var(--border)] sm:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex h-11 shrink-0 items-center justify-between px-7 text-[13px] font-medium">
          <span>9:41</span>
          <span className="flex items-center gap-1.5 opacity-85">
            <Icon name="signal" size={14}/><Icon name="wifi" size={14}/><Icon name="battery-full" size={16}/>
          </span>
        </div>
        <div className="relative min-h-0 flex-1">
        {closed ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-[15px] text-[var(--text-2)]">
              {paid
                ? 'PRO yoqildi — ilovadagi to\u2018qqizta imkoniyat ochildi.'
                : 'Ekran yopildi — foydalanuvchi ilovaga qaytdi.'}
            </p>
            <a href="../mobile-app/index.html"
              className="flex min-h-[44px] items-center rounded-[999px] bg-[var(--btn-primary-bg)] px-4 text-[15px] font-medium text-[var(--btn-primary-fg)]">
              Ilovaga qaytish
            </a>
            <button type="button" onClick={()=>{ setPaid(false); setClosed(false); }}
              className="min-h-[44px] rounded-[999px] border border-[var(--border)] px-4 text-[15px] font-medium text-[var(--ink)]">
              Qaytadan ochish
            </button>
            {paid && (
              <button type="button"
                onClick={()=>{ if (typeof writeProStatus === 'function') writeProStatus('free'); setPaid(false); }}
                className="min-h-[44px] text-[13px] font-medium text-[var(--text-2)]">
                Obunani bekor qilish (test)
              </button>
            )}
          </div>
        ) : screen === 'tariffs' ? (
          <TariffsScreen source={source} state={state} selected={selected}
            onSelect={setSelected}
            onContinue={()=>setScreen('payment')}
            onDismiss={()=>setClosed(true)}
            onRetry={()=>setState('ready')}/>
        ) : (
          <PaymentMethodScreen plan={plan}
            onBack={()=>setScreen('tariffs')}
            onPick={()=>{
              // A completed payment is what grants PRO. The app reads this key on load,
              // so every one of the nine features is open when the user lands back.
              if (typeof writeProStatus === 'function') writeProStatus('pro', plan.id);
              setPaid(true);
              setClosed(true);
            }}/>
        )}
        </div>
        <div className="flex h-6 shrink-0 items-center justify-center">
          <span className="h-[5px] w-[124px] rounded-full bg-[var(--ink)] opacity-[0.18]"/>
        </div>
      </div>

      <div className="flex w-[260px] shrink-0 flex-col gap-4 rounded-[20px] border border-[var(--chegara)] bg-[var(--karta)] p-4 text-[var(--siyoh)]">
        <Group label="Qayerdan kelgan">
          {Object.keys(SARLAVHA).map(k => (
            <Toggle key={k} on={source===k} onClick={()=>{ setSource(k); setScreen('tariffs'); setClosed(false); }}>{k}</Toggle>
          ))}
        </Group>
        <Group label="Holat">
          {['ready','loading','error'].map(s => (
            <Toggle key={s} on={state===s} onClick={()=>{ setState(s); setScreen('tariffs'); setClosed(false); }}>{s}</Toggle>
          ))}
        </Group>
        <Group label="Mavzu">
          <Toggle on={!dark} onClick={()=>setDark(false)}>Yorug'</Toggle>
          <Toggle on={dark} onClick={()=>setDark(true)}>Qorong'i</Toggle>
        </Group>
        <p className="text-[13px] leading-snug text-[var(--matn-2)]">
          Narxlar API dan keladi — oyiga qancha va necha foiz tejash render vaqtida
          hisoblanadi. Tanlangan tarif 2-ekranga o'tib qaytganda saqlanadi.
        </p>
      </div>
    </div>
  );
}

function Group({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium text-[var(--matn-2)]">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Toggle({ on, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={'min-h-[32px] rounded-[12px] px-3 text-[13px] font-medium ' +
        (on ? 'bg-[var(--siyoh)] text-[var(--on-siyoh)]' : 'border border-[var(--chegara)] text-[var(--siyoh)]')}>
      {children}
    </button>
  );
}
