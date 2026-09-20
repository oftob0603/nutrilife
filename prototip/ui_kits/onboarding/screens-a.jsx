// O1–O6
function O1({ app }) {
  const [leaving,setLeaving] = React.useState(false);
  const start = () => { setLeaving(true); setTimeout(()=>app.next({ terms:true }), 320); };
  return (
    <div style={{
      position:'absolute', top:-44, bottom:-24, left:0, right:0, overflow:'hidden', background:'#EDF6E4',
      opacity: leaving ? 0 : 1,
      transform: leaving ? 'scale(1.04)' : 'scale(1)',
      transition:'opacity 320ms var(--ease), transform 320ms var(--ease)',
    }}>
      <img src="../../assets/onboarding-intro.png" alt="Ozish, vazn olish, sog'lom turmush tarzi va vaznni saqlash"
        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'contain', objectPosition:'center top', display:'block' }}/>
      <div style={{
        position:'absolute', left:0, right:0, bottom:0,
        borderRadius:'32px 32px 0 0', overflow:'hidden', isolation:'isolate',
        borderTop:'1px solid var(--yashil-chegara)',
        boxShadow:'0 -2px 32px rgba(11,11,12,0.14)',
      }}>
        <div aria-hidden="true" style={{
          position:'absolute', inset:0, zIndex:0, pointerEvents:'none',
          background:'var(--yashil-fon)', border:'1px solid var(--yashil-chegara)', borderRadius:'32px 32px 0 0',
        }}/>
        <div style={{
          position:'relative', zIndex:1, filter:'none', backdropFilter:'none', opacity:1,
          padding:'var(--space-6) var(--screen-gutter) calc(var(--space-6) + 24px)',
          display:'flex', flexDirection:'column', gap:'var(--space-4)',
          color:'#0F1C14', mixBlendMode:'normal', textShadow:'none',
        }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
          <span style={{ font:'var(--type-card-title)', fontFamily:'var(--font-display)', letterSpacing:'var(--ls-ring)', color:'#3F5347', WebkitTextFillColor:'#3F5347', opacity:1 }}>NutriLife</span>
          <h1 style={{ font:'var(--type-screen-title)', letterSpacing:'var(--ls-title)', color:'#0F1C14', WebkitTextFillColor:'#0F1C14', opacity:1, textShadow:'none', filter:'none', mixBlendMode:'normal', margin:0 }}>
            Taomingiz haqida ko‘proq bilishni xohlaysizmi?
          </h1>
        </div>
        <span style={{ font:'var(--type-caption)', color:'#3F5347', WebkitTextFillColor:'#3F5347', opacity:1, textAlign:'center' }}>
          “Boshlash”ni bosish orqali Ommaviy oferta shartlarini qabul qilasiz.
        </span>
        {/* Colour, press state and label come from the primary Button. The 17px radius
            it used to override with is gone \u2014 the button is pill-shaped like every other
            primary CTA. The soft green shadow stays as O1's one remaining exception. */}
        <Button variant="primary" full onClick={start}
          style={{
            height:52,
            boxShadow:'0 1px 2px rgba(21,128,61,0.18), 0 4px 12px rgba(21,128,61,0.16)',
          }}>Boshlash</Button>
        </div>
      </div>
    </div>
  );
}

function O3({ app }) {
  const [name,setName] = React.useState(app.d.name);
  const bad = name.trim().length < 1 || name.length > 40;
  return (
    <Step n={2} onBack={app.prev} title="Sizni qanday chaqiraylik?"
      action="Davom etish" actionDisabled={bad} onAction={()=>app.next({ name })}>
      <Input label="Ism" value={name} onChange={setName} placeholder="Aziz"
        error={name.length > 40 ? "40 belgidan oshmasin" : undefined}/>
      <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>Bu faqat salomlashish uchun</span>
    </Step>
  );
}

function O4({ app }) {
  return (
    <Step n={3} onBack={app.prev} title="Nimaga erishmoqchisiz?"
      action="Davom etish" actionDisabled={!app.d.goal} onAction={()=>app.next({})}>
      <Choices>
        {MAQSADLAR.map(g=>(
          <OptionRow key={g.value} label={t(g.label)} caption={t(g.caption)}
            selected={app.d.goal===g.value} onClick={()=>app.set({ goal:g.value })}/>
        ))}
      </Choices>
    </Step>
  );
}

/* Age is picked on an inline wheel that is ALWAYS visible — no field to tap, no sheet,
   no expand/collapse. Five rows at 40px keeps it compact enough to live on the screen
   permanently without pushing «Davom etish» out of reach.

   Built on native scroll-snap rather than a drag handler: it inherits momentum,
   rubber-banding and keyboard scrolling, and `scroll-snap-align: center` does the
   settling a hand-rolled version gets subtly wrong.

   Range is 13–100 as asked. It collides with this screen's own 18+ rule, so the under-18
   notice stays below the wheel rather than being silently dropped — picking 13 surfaces
   the warning instead of being impossible. Say if that rule should go entirely. */
const AGE_ROW = 40;

function AgeWheel({ value, onPick }) {
  const ages = [];
  for (let a = 13; a <= 100; a++) ages.push(a);
  const at = (v) => { const i = ages.indexOf(Number(v)); return i < 0 ? ages.indexOf(25) : i; };
  const [idx,setIdx] = React.useState(()=>at(value));
  const col = React.useRef(null);
  const tmr = React.useRef(null);

  // Mount centred on the current value, or on 25 when nothing is chosen yet.
  React.useEffect(()=>{
    if (col.current) col.current.scrollTop = at(value) * AGE_ROW;
  }, []);

  const onScroll = () => {
    const el = col.current;
    if (!el) return;
    const read = () => Math.max(0, Math.min(ages.length-1, Math.round(el.scrollTop / AGE_ROW)));
    const i = read();
    setIdx(i);
    onPick(String(ages[i]));
    clearTimeout(tmr.current);
    tmr.current = setTimeout(()=>{            // settle after the snap animation
      const j = read(); setIdx(j); onPick(String(ages[j]));
    }, 90);
  };

  const pad = AGE_ROW * 2;  // blank rows so 13 and 100 can reach the centre slot
  return (
    <div style={{
      position:'relative', height:AGE_ROW * 5,
      background:'var(--karta)', border:'var(--hairline)', borderRadius:'var(--r-card)',
      overflow:'hidden',
    }}>
      <div aria-hidden="true" style={{
        position:'absolute', left:'var(--space-2)', right:'var(--space-2)',
        top:AGE_ROW * 2, height:AGE_ROW,
        background:'var(--fon)', borderRadius:'var(--r-chip)', pointerEvents:'none',
      }}/>
      <div ref={col} onScroll={onScroll} style={{
        position:'relative', height:'100%', overflowY:'auto',
        scrollSnapType:'y mandatory', scrollbarWidth:'none',
        WebkitMaskImage:'linear-gradient(transparent,#000 24%,#000 76%,transparent)',
        maskImage:'linear-gradient(transparent,#000 24%,#000 76%,transparent)',
      }}>
        <div style={{ height:pad }}/>
        {ages.map((a,i)=>{
          const on = i === idx, near = Math.abs(i - idx) === 1;
          return (
            <div key={a} style={{
              height:AGE_ROW, scrollSnapAlign:'center',
              display:'flex', alignItems:'center', justifyContent:'center',
              font: on ? 'var(--type-stat)' : 'var(--type-body)',
              color: on ? 'var(--siyoh)' : near ? 'var(--matn-2)' : 'var(--matn-3)',
              fontVariantNumeric:'tabular-nums',
              transition:'color var(--tez) var(--ease)',
            }}>{a}</div>
          );
        })}
        <div style={{ height:pad }}/>
      </div>
    </div>
  );
}

function O5({ app }) {
  /* Seeded to 25 rather than empty: the wheel is always visible and always shows a
     centred value, so an empty `age` would contradict what the user sees and leave
     «Davom etish» disabled beneath a wheel plainly reading 25. */
  const [age,setAge] = React.useState(app.d.age || '25');
  const under = age !== '' && Number(age) < 18;
  const bad = !age;
  return (
    <Step n={4} onBack={app.prev} title="Hisob to'g'ri chiqishi uchun bir-ikki raqam kerak"
      action="Davom etish" actionDisabled={bad || !app.d.gender} onAction={()=>app.next({ age })}>
      <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>Jins</span>
        <Choices>
          {GENDERS.map(g=>(
            <OptionRow key={g.value} label={t(g.label)} selected={app.d.gender===g.value}
              onClick={()=>app.set({ gender:g.value })}/>
          ))}
        </Choices>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{t('Yosh')}</span>
        <AgeWheel value={age} onPick={setAge}/>
      </div>
      {under && (
        <span style={{ font:'var(--type-caption)', color:'var(--xato)' }}>
          Ilovadan 18 yoshdan katta foydalanuvchilar foydalanishi mumkin
        </span>
      )}
      <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
        Jins va yosh faqat kaloriya formulasi uchun ishlatiladi
      </span>
    </Step>
  );
}

/* Horizontal sibling of AgeWheel, for height and the two weights. Same scroll-snap
   mechanism, rotated: values run left-to-right, the centre column is the selection, and
   neighbours stay partly visible and muted.

   Steps differ by measure — whole cm and lb, half-kg, tenths of a foot — so `step` is a
   parameter, and values are held as strings formatted to that step's precision. That
   matters: validation and the calorie formula both read these as numbers, and 70 vs 70.0
   must not become two different answers.

   Centre padding uses `calc(50% - HALF)` spacers, so the first and last value can reach
   the middle whatever width the field renders at. */
const VW_COL = 72;

function ValueWheel({ value, onPick, min, max, step, decimals }) {
  const vals = React.useMemo(()=>{
    const out = [];
    // Integer arithmetic: adding 0.1 repeatedly accumulates float error over hundreds of rows.
    const n = Math.round((max - min) / step);
    for (let i = 0; i <= n; i++) out.push((min + i * step).toFixed(decimals));
    return out;
  }, [min, max, step, decimals]);

  /* SNAPS to the nearest valid index rather than looking the value up exactly. An exact
     `indexOf` misses whenever a value sits off the step grid — a converted 69.9 on a
     half-kg wheel — and the old fallback to index 0 silently rewrote the user's 80 kg
     as 30 kg. Rounding into range means no caller can reintroduce that. */
  const at = (v) => {
    if (v === '' || v == null || isNaN(Number(v))) return -1;
    return Math.max(0, Math.min(vals.length - 1, Math.round((Number(v) - min) / step)));
  };

  const [idx,setIdx] = React.useState(()=>{ const i = at(value); return i < 0 ? 0 : i; });
  const row = React.useRef(null);
  const tmr = React.useRef(null);
  /* The value this wheel last positioned itself to. Compared against, rather than timed
     against: a scroll landing on the same value is the echo of our own assignment and
     must not write back, whatever order the events arrive in. The previous 120ms guard
     made the outcome depend on that race. */
  const settled = React.useRef(null);

  /* An untouched field stays EMPTY — a wheel centred on some arbitrary value would
     otherwise submit a height nobody chose. */
  const [touched,setTouched] = React.useState(()=>at(value) >= 0);

  React.useEffect(()=>{
    if (!row.current) return;
    const i = at(value);
    settled.current = i >= 0 ? vals[i] : null;
    row.current.scrollLeft = (i < 0 ? 0 : i) * VW_COL;
    setIdx(i < 0 ? 0 : i);
    setTouched(i >= 0);
  }, [vals, value]);

  const onScroll = () => {
    const el = row.current;
    if (!el) return;
    const commit = () => {
      const i = Math.max(0, Math.min(vals.length-1, Math.round(el.scrollLeft / VW_COL)));
      setIdx(i); setTouched(true);
      if (vals[i] !== settled.current) { settled.current = vals[i]; onPick(vals[i]); }
    };
    commit();
    clearTimeout(tmr.current);
    tmr.current = setTimeout(commit, 90);   // settle after the snap animation
  };

  const half = VW_COL / 2;
  return (
    <div style={{
      position:'relative', height:64,
      background:'var(--karta)', border:'var(--hairline)', borderRadius:'var(--r-card)',
      overflow:'hidden',
    }}>
      <div aria-hidden="true" style={{
        position:'absolute', top:'var(--space-2)', bottom:'var(--space-2)',
        left:'calc(50% - ' + half + 'px)', width:VW_COL,
        background:'var(--fon)', borderRadius:'var(--r-chip)', pointerEvents:'none',
      }}/>
      <div ref={row} onScroll={onScroll} style={{
        position:'relative', height:'100%', display:'flex', overflowX:'auto',
        scrollSnapType:'x mandatory', scrollbarWidth:'none',
        WebkitMaskImage:'linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent)',
        maskImage:'linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent)',
      }}>
        <div style={{ flex:'0 0 calc(50% - ' + half + 'px)' }}/>
        {vals.map((v,i)=>{
          const on = touched && i === idx, near = touched && Math.abs(i - idx) === 1;
          return (
            <div key={v} style={{
              flex:'0 0 ' + VW_COL + 'px', scrollSnapAlign:'center',
              display:'flex', alignItems:'center', justifyContent:'center',
              font: on ? 'var(--type-stat)' : 'var(--type-body)',
              color: on ? 'var(--siyoh)' : near ? 'var(--matn-2)' : 'var(--matn-3)',
              fontVariantNumeric:'tabular-nums',
              transition:'color var(--tez) var(--ease)',
            }}>{v}</div>
          );
        })}
        <div style={{ flex:'0 0 calc(50% - ' + half + 'px)' }}/>
      </div>
    </div>
  );
}

/* Label + wheel + the unit, error, warning and footer slots Input used to render — so
   swapping the control does not quietly drop its validation messaging. */
function WheelField({ label, unit, error, warning, footer, ...wheel }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
      <span style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{label}</span>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{unit}</span>
      </span>
      <ValueWheel {...wheel}/>
      {error && <span style={{ font:'var(--type-caption)', color:'var(--xato)' }}>{error}</span>}
      {!error && warning && <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{warning}</span>}
      {footer}
    </div>
  );
}

/* Unit handling. State holds CANONICAL METRIC — centimetres and kilograms — always; the
   wheels convert only for display. Converting the STORED value on each unit switch is
   what caused the round-trip drift (70 → 154 lb → 69.9, or worse, 80 → 30): every switch
   rounded again, and the result landed off the destination wheel's step grid. With one
   canonical unit there is nothing to re-round — kg → lb → kg is exact, and the display
   simply re-derives from the untouched metric value. */
const FT = 30.48, LB = 2.20462;

function O6({ app }) {
  // Always metric, whatever the segmented control displays.
  const [h,setH] = React.useState(app.d.height);
  const [w,setW] = React.useState(app.d.weight);
  // `tgt`, not `t`: `t` is the global translator, and a local of that name shadows it
  // for this whole function — any t() call in this scope would break.
  const [tgt,setTgt] = React.useState(app.d.target);
  const metric = app.d.units === 'metric';

  // Validator and calorie formula are metric-only; state already is.
  const v = olchovTekshiruvi({ goal:app.d.goal, height:h, weight:w, target:tgt });
  const incomplete = !h || !w || (v.needTarget && !tgt);

  /* Height stops at the validator's own 120–230 cm band, so no selectable value can be
     rejected — the same rule applied to the age wheel. Weight's 30–300 already matches. */
  const hRange = metric ? { min:120, max:230, step:1, decimals:0 } : { min:3.9, max:7.6, step:0.1, decimals:1 };
  const wRange = metric ? { min:30, max:300, step:0.5, decimals:1 } : { min:66, max:660, step:1, decimals:0 };

  // metric state → displayed value; picked value → metric state.
  const showH = (cm) => (cm === '' || cm == null ? '' : metric ? String(Math.round(Number(cm))) : (Number(cm) / FT).toFixed(1));
  const takeH = (d) => setH(metric ? Number(d) : Number(d) * FT);
  const showW = (kg) => (kg === '' || kg == null ? '' : metric ? Number(kg).toFixed(1) : String(Math.round(Number(kg) * LB)));
  const takeW = (set) => (d) => set(metric ? Number(d) : Number(d) / LB);

  return (
    <Step n={5} onBack={app.prev} title="Bo'yingiz va vazningiz?"
      action="Davom etish" actionDisabled={incomplete || v.blocked}
      onAction={()=>app.next({ height:h, weight:w, target:tgt })}>
      <SegmentedControl options={[{value:'metric',label:'kg · sm'},{value:'imperial',label:'lb · ft'}]}
        value={app.d.units} onChange={(u)=>app.set({ units:u })}/>
      <WheelField label="Bo'y" unit={metric?'sm':'ft'} value={showH(h)} onPick={takeH}
        error={v.heightError} {...hRange}/>
      <WheelField label="Joriy vazn" unit={metric?'kg':'lb'} value={showW(w)} onPick={takeW(setW)}
        error={v.weightError} warning={v.saqlashEslatma} {...wRange}/>
      {v.needTarget && (
        <WheelField label="Maqsad vazn" unit={metric?'kg':'lb'} value={showW(tgt)} onPick={takeW(setTgt)}
          error={v.targetError} warning={v.targetSafety || v.nearGoal} {...wRange}
          footer={(v.direction || v.nearGoal) && (
            <span style={{ display:'flex', flexWrap:'wrap', gap:'var(--space-2)' }}>
              {v.direction && <Button variant="tertiary" size="sm" onClick={()=>setTgt('')}>Raqamni to'g'rilash</Button>}
              <Button variant="tertiary" size="sm" onClick={()=>app.go(3)}>Maqsadni o'zgartirish</Button>
            </span>
          )}/>
      )}
    </Step>
  );
}

Object.assign(window, { O1, O3, O4, O5, O6 });
