// O7–O10
function O7({ app }) {
  return (
    <Step n={6} onBack={app.prev} title="Kuningiz qanday o'tadi?"
      action="Davom etish" actionDisabled={!app.d.activity} onAction={()=>app.next({})}>
      <Choices>
        {ACTIVITY.map(a=>(
            <OptionRow key={a.value} label={t(a.label)} caption={t(a.caption)}
            selected={app.d.activity===a.value} onClick={()=>app.set({ activity:a.value })}/>
        ))}
      </Choices>
    </Step>
  );
}

function O8({ app }) {
  const toggle = (p) => {
    const none = "Cheklov yo'q";
    let list = app.d.prefs;
    if (p === none) list = list.includes(none) ? [] : [none];
    else list = list.filter(x=>x!==none).includes(p)
      ? list.filter(x=>x!==p)
      : [...list.filter(x=>x!==none), p];
    app.set({ prefs:list });
  };
  return (
    <Step n={7} onBack={app.prev} onSkip={()=>app.next({ prefs:[] })} title="Ovqatda cheklovingiz bormi?"
      caption="Bu normaga ta'sir qilmaydi — taom takliflari va retseptlar uchun."
      action="Davom etish" onAction={()=>app.next({})}>
      <Choices>
        {PREFS.map(p=>(
          <OptionRow key={p} multi label={p} selected={app.d.prefs.includes(p)} onClick={()=>toggle(p)}/>
        ))}
      </Choices>
    </Step>
  );
}

function O9({ app }) {
  return (
    <Step n={8} onBack={app.prev} onSkip={()=>app.next({})} title="Odatda qanday ovqatlanasiz?"
      action="Davom etish" onAction={()=>app.next({})}>
      <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>Kuniga necha mahal</span>
        <SegmentedControl options={MEALS_PER_DAY} value={app.d.mealsPerDay} onChange={(v)=>app.set({ mealsPerDay:v })}/>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>Asosan qayerda</span>
        <Choices>
          {EAT_WHERE.map(w=>(
            <OptionRow key={w} label={w} selected={app.d.where===w} onClick={()=>app.set({ where:w })}/>
          ))}
        </Choices>
      </div>
    </Step>
  );
}

function O10({ app }) {
  const [saving,setSaving] = React.useState(false);
  return (
    <Step n={9} onBack={app.prev} onSkip={()=>app.next({})} title="Nima sizni harakatga undaydi?"
      caption="Eslatma va matnlarni shunga qarab tanlaymiz."
      action="Davom etish" actionLoading={saving} saveError={app.saveError}
      onAction={()=>{ setSaving(true); setTimeout(()=>{ setSaving(false); app.next({}); }, 500); }}>
      <Choices>
        {MOTIVES.map(m=>(
          <OptionRow key={m} label={m} selected={app.d.motive===m} onClick={()=>app.set({ motive:m })}/>
        ))}
      </Choices>
    </Step>
  );
}

Object.assign(window, { O7, O8, O9, O10 });
