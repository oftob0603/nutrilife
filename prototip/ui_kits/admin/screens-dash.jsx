// A1 dashboard, A10 statistics, A12 prices
function A1({ go, loading }) {
  return (
    <Page title="Boshqaruv paneli" caption="13-sentabr, shanba">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--card-gap)' }}>
        <StatTile label="Bugungi yangi foydalanuvchilar" value={loading?undefined:'42'} loading={loading} icon="user-plus"/>
        <StatTile label="Kunlik faol" value={loading?undefined:son(1870)} loading={loading} icon="activity"/>
        <StatTile label="Bugungi skanlar" value={loading?undefined:son(1284)} loading={loading} icon="scan-line"/>
        <StatTile label="Faol PRO obunalar" value={loading?undefined:'312'} loading={loading} icon="crown"/>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
        <span style={{ font:'var(--type-card-title)' }}>Ish navbatlari</span>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'var(--card-gap)' }}>
          <StatTile label="Tasdiq kutayotgan takliflar" value="7" icon="inbox" onClick={()=>go('a4')}/>
          <StatTile label="Ko'rilmagan so'rovlar" value="2" icon="message-square-warning" onClick={()=>go('a11')}/>
          <StatTile label="7 kun ichida tugaydigan obunalar" value="5" icon="clock" onClick={()=>go('a2')}/>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
        <span style={{ font:'var(--type-card-title)' }}>Oxirgi amallar</span>
        <DataTable
          columns={[
            { key:'sana', label:'Sana', width:'160px', muted:true, numeric:true },
            { key:'kim', label:'Kim', width:'100px', muted:true },
            { key:'amal', label:'Amal', width:'minmax(0,2fr)' },
            { key:'sabab', label:'Sabab', width:'160px', muted:true },
          ]}
          rows={LOG}/>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
          Jurnal tahrirlanmaydi va o'chirilmaydi
        </span>
      </div>
    </Page>
  );
}

function Sparkline({ points, label, value }) {
  const max = Math.max(...points), min = Math.min(...points);
  const d = points.map((p,i)=>{
    const x = (i/(points.length-1))*100;
    const y = 40 - ((p-min)/((max-min)||1))*34;
    return (i?'L':'M') + x.toFixed(1) + ' ' + y.toFixed(1);
  }).join(' ');
  return (
    <div style={{ background:'var(--karta)', border:'var(--hairline)', borderRadius:'var(--r-card)', padding:'var(--space-4)', display:'flex', flexDirection:'column', gap:'var(--space-2)', minWidth:0 }}>
      <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{label}</span>
      <span style={{ font:'var(--type-stat)', fontVariantNumeric:'tabular-nums' }}>{value}</span>
      <svg viewBox="0 0 100 44" preserveAspectRatio="none" style={{ width:'100%', height:44 }}>
        <path d={d} fill="none" stroke="var(--siyoh)" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
      </svg>
    </div>
  );
}

/* A10's chart. One metric per card, each in its own series colour, with a real date axis.

   The axis thins its LABELS as the period grows (every day at 7, every 5th at 30, every
   15th at 90) but never thins the DATA — all 90 readings are plotted; only the tick text
   is sampled, because 90 labels in a 420px card is an unreadable smear. Hovering reads
   out the exact day and value, so the thinned labels cost nothing. */
function MetricChart({ metric, days }) {
  const data = React.useMemo(() => metrikaSeriya(metric, days), [metric.key, days]);
  const [hover,setHover] = React.useState(null);
  const H = 96, PAD = 6;
  const vals = data.map(d=>d.qiymat);
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = (max - min) || 1;
  const x = (i) => (i / Math.max(1, data.length - 1)) * 100;
  const y = (v) => PAD + (1 - (v - min) / span) * (H - PAD * 2);
  const line = data.map((d,i)=>(i?'L':'M') + x(i).toFixed(2) + ' ' + y(d.qiymat).toFixed(2)).join(' ');
  const area = line + ' L100 ' + H + ' L0 ' + H + ' Z';
  const stroke = 'var(--metrika-' + metric.seriya + ')';
  const every = days <= 7 ? 1 : days <= 30 ? 5 : 15;
  const ticks = data.map((d,i)=>({ ...d, i })).filter((d,i)=>i % every === 0 || i === data.length-1);
  const cur = hover != null ? data[hover] : null;
  const fmtQ = (v) => (metric.birlik === '%' ? v + '%' : son(v));

  return (
    <div style={{ background:'var(--karta)', border:'var(--hairline)', borderRadius:'var(--r-card)', padding:'var(--space-4)', display:'flex', flexDirection:'column', gap:'var(--space-2)', minWidth:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', minWidth:0 }}>
        <span style={{ width:8, height:8, borderRadius:'var(--r-pill)', background:stroke, flex:'0 0 auto' }}/>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{metric.label}</span>
      </div>
      <div style={{ display:'flex', alignItems:'baseline', gap:'var(--space-2)', minHeight:28 }}>
        <span style={{ font:'var(--type-stat)', fontVariantNumeric:'tabular-nums' }}>
          {cur ? fmtQ(cur.qiymat) : metric.jami}
        </span>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>
          {cur ? cur.kun + '-' + cur.oy + ', ' + cur.hafta : days + ' kun'}
        </span>
      </div>
      <svg viewBox={'0 0 100 ' + H} preserveAspectRatio="none"
        style={{ width:'100%', height:H, display:'block', overflow:'visible' }}
        onMouseLeave={()=>setHover(null)}
        onMouseMove={(e)=>{
          const r = e.currentTarget.getBoundingClientRect();
          const p = (e.clientX - r.left) / r.width;
          setHover(Math.max(0, Math.min(data.length-1, Math.round(p * (data.length-1)))));
        }}>
        <path d={area} fill={stroke} opacity="0.10" stroke="none"/>
        <path d={line} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round"
          strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
        {cur && (
          <g>
            <line x1={x(hover)} y1="0" x2={x(hover)} y2={H} stroke="var(--chegara)"
              strokeWidth="1" vectorEffect="non-scaling-stroke"/>
            <circle cx={x(hover)} cy={y(cur.qiymat)} r="3" fill="var(--karta)"
              stroke={stroke} strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
          </g>
        )}
      </svg>
      <div style={{ display:'flex', justifyContent:'space-between', gap:'var(--space-1)' }}>
        {ticks.map(t=>(
          <span key={t.iso} style={{
            font:'var(--type-badge)', color:'var(--matn-3)', fontVariantNumeric:'tabular-nums',
            whiteSpace:'nowrap',
          }}>{days <= 7 ? t.hafta : t.kun + '.' + String(new Date(t.iso+'T00:00:00').getMonth()+1).padStart(2,'0')}</span>
        ))}
      </div>
    </div>
  );
}

/* Revenue bars. A bar chart, not a line: months and days are discrete buckets, and a line
   between them would imply a rate that was never measured. Hovering reads out the exact
   bucket; the tallest bar sets the scale. */
function RevenueBars({ data, label, valueKey = 'summa', series, compact = false }) {
  const [hover,setHover] = React.useState(null);
  const max = Math.max(...data.map(d=>d[valueKey]), 1);
  const fill = 'var(--metrika-' + series + ')';
  const cur = hover != null ? data[hover] : null;
  const jami = data.reduce((s,d)=>s+d[valueKey], 0);
  return (
    <div style={{ background:'var(--karta)', border:'var(--hairline)', borderRadius:'var(--r-card)', padding:'var(--space-4)', display:'flex', flexDirection:'column', gap:'var(--space-3)', minWidth:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', minWidth:0 }}>
        <span style={{ width:8, height:8, borderRadius:'var(--r-pill)', background:fill, flex:'0 0 auto' }}/>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{label}</span>
      </div>
      <div style={{ display:'flex', alignItems:'baseline', gap:'var(--space-2)', minHeight:28, flexWrap:'wrap' }}>
        <span style={{ font:'var(--type-stat)', fontVariantNumeric:'tabular-nums' }}>
          {som(cur ? cur[valueKey] : jami)}
        </span>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>
          {cur ? (cur.oy || (cur.kun + '-kun, ' + cur.hafta)) : 'jami'}
        </span>
      </div>
      <div style={{ display:'flex', alignItems:'flex-end', gap:compact ? 'var(--space-2)' : 4, height:compact ? 96 : 120 }}
        onMouseLeave={()=>setHover(null)}>
        {data.map((d,i)=>(
          <span key={d.key || d.iso} onMouseEnter={()=>setHover(i)}
            style={{ flex:1, minWidth:0, height:'100%', display:'flex', alignItems:'flex-end', cursor:'default' }}>
            <span style={{
              width:'100%', height:Math.max(2, (d[valueKey]/max)*100) + '%',
              borderRadius:'var(--r-chip)', background:fill,
              opacity: hover == null || hover === i ? 1 : 0.35,
              transition:'opacity var(--tez) var(--ease)',
            }}/>
          </span>
        ))}
      </div>
      <div style={{ display:'flex', gap:compact ? 'var(--space-2)' : 4 }}>
        {data.map(d=>(
          <span key={d.key || d.iso} style={{
            flex:1, minWidth:0, textAlign:'center', font:'var(--type-badge)',
            color:'var(--matn-3)', fontVariantNumeric:'tabular-nums',
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{d.qisqa || d.hafta}</span>
        ))}
      </div>
    </div>
  );
}

function RevenueTile({ label, value, caption, series }) {
  return (
    <div style={{ background:'var(--karta)', border:'var(--hairline)', borderRadius:'var(--r-card)', padding:'var(--space-4)', display:'flex', flexDirection:'column', gap:'var(--space-2)', minWidth:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
        <span style={{ width:8, height:8, borderRadius:'var(--r-pill)', background:'var(--metrika-' + series + ')', flex:'0 0 auto' }}/>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{label}</span>
      </div>
      <span style={{ font:'var(--type-stat)', fontVariantNumeric:'tabular-nums' }}>{value}</span>
      {caption && <span style={{ font:'var(--type-caption)', color:'var(--matn-3)' }}>{caption}</span>}
    </div>
  );
}

function A10() {
  const [period,setPeriod] = React.useState('30');
  const days = Number(period);
  const oylar = React.useMemo(()=>daromadOylar(), []);
  const hafta = React.useMemo(()=>daromadKunlar(7), []);
  const jami = daromadJami();
  const bugun = daromadBugun();
  const haftaJami = hafta.reduce((s,d)=>s+d.summa, 0);
  const oyJoriy = oylar[oylar.length-1];
  return (
    <Page title="Statistika" caption="North star metrika hali tanlanmagan — uchala metrika teng ko'rsatiladi (PRD 9-bo'lim, 1-savol)">
      <Toolbar>
        <SegmentedControl style={{ maxWidth:320 }} value={period} onChange={setPeriod}
          options={[{value:'7',label:'7 kun'},{value:'30',label:'30 kun'},{value:'90',label:'90 kun'}]}/>
      </Toolbar>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'var(--card-gap)' }}>
        {METRIKA.map(m=><MetricChart key={m.key} metric={m} days={days}/>)}
        <div style={{ background:'var(--karta)', border:'var(--hairline)', borderRadius:'var(--r-card)', padding:'var(--space-4)', display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
          <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>Skan tannarxi</span>
          <span style={{ font:'var(--type-stat)', fontVariantNumeric:'tabular-nums' }}>$184</span>
          <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
            {son(28410)} skan · taxminiy xarajat. Birlik iqtisodiyoti shu yerdan kuzatiladi.
          </span>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'var(--card-gap)' }}>
        <span style={{ font:'var(--type-card-title)' }}>Daromad</span>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'var(--card-gap)' }}>
          <RevenueTile series="2" label="Umumiy daromad" value={som(jami)}
            caption={son(PAYMENTS.length) + " to'lov · boshidan bugungacha"}/>
          <RevenueTile series="1" label="Bugungi daromad" value={som(bugun)}
            caption={son(PAYMENTS.filter(p=>p.iso===BUGUN).length) + " to'lov · " + BUGUN}/>
          <RevenueTile series="3" label="So'nggi 7 kunlik daromad" value={som(haftaJami)}
            caption={hafta[0].kun + '-' + hafta[0].hafta + ' — bugun'}/>
          <RevenueTile series="4" label={'Joriy oy — ' + (oyJoriy ? oyJoriy.oy : '')}
            value={som(oyJoriy ? oyJoriy.summa : 0)} caption="oy boshidan bugungacha"/>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'var(--card-gap)' }}>
          <RevenueBars series="4" label="Oylik daromad" data={oylar}/>
          <RevenueBars series="3" label="So'nggi 7 kun — kunlik daromad" data={hafta} compact/>
        </div>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
          Barcha summalar to'lov jurnalidan hisoblanadi · narxlar «Narxlar» bo'limidan olinadi.
          Qo'lda berilgan obunalar daromadga kirmaydi.
        </span>
      </div>
    </Page>
  );
}

function A12() {
  const [prices,setPrices] = React.useState(PRICES);
  const [draft,setDraft] = React.useState(null);
  const edit = (id,v) => setPrices(p=>p.map(x=>x.id===id?{...x,narx:v.replace(/\D/g,'')}:x));
  return (
    <Page title="Narxlar" actions={<Button variant="primary" onClick={()=>setDraft(prices)}>Saqlash</Button>}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'var(--card-gap)' }}>
        {prices.map(p=>(
          <Card key={p.id} style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
            <span style={{ font:'var(--type-card-title)' }}>{p.nomi}</span>
            <Input value={p.narx} onChange={(v)=>edit(p.id,v)} unit="so'm" numeric/>
          </Card>
        ))}
      </div>
      <Note title="Narx o'zgarishi mavjud obunalarga ta'sir qilmaydi">
        Faol obuna o'z narxi bilan muddati tugaguncha ishlaydi. Yangi narx faqat yangi to'lovlarga qo'llanadi.
      </Note>
      <Modal open={!!draft} onClose={()=>setDraft(null)} title="Narxlarni o'zgartirish"
        description="Narx o'zgarishi mavjud obunalarga ta'sir qilmaydi — faol obunalar o'z narxi bilan muddati tugaguncha ishlaydi."
        confirmLabel="Tasdiqlash" onConfirm={()=>setDraft(null)}>
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
          {PRICES.map((old,i)=>(
            <span key={old.id} style={{ display:'flex', justifyContent:'space-between', font:'var(--type-body)' }}>
              <span>{old.nomi}</span>
              <span style={{ fontVariantNumeric:'tabular-nums', color:'var(--matn-2)' }}>
                {som(old.narx)} → <span style={{ color:'var(--siyoh)' }}>{som((draft||PRICES)[i].narx||0)}</span>
              </span>
            </span>
          ))}
        </div>
      </Modal>
    </Page>
  );
}

Object.assign(window, { A1, A10, A12, Sparkline, MetricChart, RevenueBars, RevenueTile });
