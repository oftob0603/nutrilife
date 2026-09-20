// A4 suggestion queue, A5 review, A11 requests (So'rovlar) with per-user chat
function A4({ openSuggestion, emptyQueue }) {
  const [filter,setFilter] = React.useState('Yangi');
  const rows = emptyQueue ? [] : SUGGESTIONS.filter(s=>filter==='Hammasi'||s.holat===filter.toLowerCase());
  return (
    <Page title="Takliflar navbati" caption="Eng eskisi birinchi">
      <Toolbar>
        {['Hammasi','Yangi',"Ko'rib chiqilmoqda",'Tasdiqlangan','Rad etilgan'].map(t=>(
          <Chip key={t} selected={filter===t} onClick={()=>setFilter(t)}>{t}</Chip>
        ))}
      </Toolbar>
      <DataTable onRowClick={openSuggestion}
        columns={[
          { key:'rasm', label:'Rasm', width:'72px', render:()=>(
            <span style={{ width:40, height:40, borderRadius:'var(--r-chip)', background:'var(--fon)', border:'var(--hairline)', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="image" size={16} color="var(--matn-3)"/>
            </span>) },
          { key:'ai', label:'AI nima degan', width:'minmax(0,1.4fr)', muted:true },
          { key:'tuzatish', label:'Foydalanuvchi tuzatishi', width:'minmax(0,1.4fr)' },
          { key:'kim', label:'Kim yuborgan', width:'minmax(0,1fr)', muted:true },
          { key:'sana', label:'Sana', width:'120px', numeric:true, muted:true },
          { key:'holat', label:'Holat', width:'150px', render:s=><Badge tone="neutral">{s.holat}</Badge> },
        ]}
        rows={rows}
        empty={<EmptyState icon="inbox" title="Navbat bo'sh"
          caption="Yangi tuzatishlar shu yerda paydo bo'ladi"/>}/>
    </Page>
  );
}

function A5({ item, back }) {
  const [decision,setDecision] = React.useState(null);
  const [rad,setRad] = React.useState('Noto\'g\'ri ma\'lumot');
  const [sabablar,setSabablar] = React.useState(()=>royxat('radSabab'));
  const [sababDialog,setSababDialog] = React.useState(false);
  const [nomlar,setNomlar] = React.useState({ uz:item.tuzatish.split(',')[0], ru:'', en:'' });
  const close = () => setDecision(null);
  const Col = ({ title, tone, children }) => (
    <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)', borderColor: tone==='ink' ? 'var(--siyoh)' : undefined }}>
      <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>{title}</span>
      {children}
    </Card>
  );
  return (
    <Page title="Taklifni ko'rib chiqish" caption={item.id + ' · ' + item.sana + ' · ' + item.kim}
      actions={<Button variant="tertiary" onClick={back}>Navbatga qaytish</Button>}>
      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:'var(--card-gap)', alignItems:'start' }}>
        <div style={{ aspectRatio:'1', borderRadius:'var(--r-card)', background:'var(--karta)', border:'var(--hairline)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'var(--space-2)' }}>
          <Icon name="image" size={28} color="var(--matn-3)"/>
          <span style={{ font:'var(--type-caption)', color:'var(--matn-3)' }}>Foydalanuvchi rasmi</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'var(--card-gap)' }}>
          <Col title="AI natijasi">
            <span style={{ font:'var(--type-card-title)' }}>{item.ai.split(',')[0]}</span>
            <span style={{ font:'var(--type-body)', color:'var(--matn-2)' }}>{item.ai.split(',')[1]}</span>
            <Badge tone="ai">AI</Badge>
          </Col>
          <Col title="Foydalanuvchi tuzatishi" tone="ink">
            <span style={{ font:'var(--type-card-title)' }}>{item.tuzatish.split(',')[0]}</span>
            <span style={{ font:'var(--type-body)', color:'var(--matn-2)' }}>{item.tuzatish.split(',')[1]}</span>
          </Col>
          <Col title="Bazadagi taom">
            {item.bazada ? (
              <>
                <span style={{ font:'var(--type-card-title)' }}>{item.bazada}</span>
                <span style={{ font:'var(--type-body)', color:'var(--matn-2)' }}>bazada mavjud</span>
              </>
            ) : (
              <span style={{ font:'var(--type-body)', color:'var(--matn-3)' }}>O'xshashi topilmadi</span>
            )}
          </Col>
        </div>
      </div>
      <Toolbar>
        <Button variant="primary" onClick={()=>setDecision('yangi')}>Tasdiqlash — yangi taom</Button>
        <Button variant="secondary" disabled={!item.bazada} onClick={()=>setDecision('birlashtirish')}>
          Tasdiqlash — mavjudiga birlashtirish
        </Button>
        <Button variant="tertiary" onClick={()=>setDecision('rad')}>Rad etish</Button>
      </Toolbar>

      <Modal open={decision==='yangi'||decision==='birlashtirish'} onClose={close} wide
        title={decision==='birlashtirish' ? 'Mavjud taomga birlashtirish' : 'Yangi taom sifatida qo\'shish'}
        description="Foydalanuvchi bitta tilda yozgan — uch til ham to'ldirilishi shart."
        confirmLabel="Tasdiqlash"
        confirmDisabled={!nomlar.uz.trim()||!nomlar.ru.trim()||!nomlar.en.trim()}
        onConfirm={close}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'var(--space-3)' }}>
          <Input label="O'zbekcha" value={nomlar.uz} onChange={(v)=>setNomlar(n=>({...n,uz:v}))}/>
          <Input label="Ruscha" value={nomlar.ru} onChange={(v)=>setNomlar(n=>({...n,ru:v}))}/>
          <Input label="Inglizcha" value={nomlar.en} onChange={(v)=>setNomlar(n=>({...n,en:v}))}/>
        </div>
      </Modal>

      <Modal open={decision==='rad'} onClose={close} title="Taklifni rad etish"
        description="Baza o'zgarmaydi, taklif yopiladi."
        confirmLabel="Rad etish" onConfirm={close}>
        {/* Reasons are admin-managed copy, so the list grows as moderators meet new cases. */}
        <Select label="Sabab" value={rad} onChange={setRad} options={sabablar}
          createLabel="Yangi qo'shish" onCreate={()=>setSababDialog(true)}/>
      </Modal>
      <RoyxatDialog open={sababDialog} onClose={()=>setSababDialog(false)} list="radSabab"
        title="Yangi rad etish sababi"
        description="Sabab barcha rad etish oynalarida darhol paydo bo'ladi."
        label="Sabab"
        onAdded={(t)=>{ setSabablar(royxat('radSabab')); setRad(t); }}/>
    </Page>
  );
}

/* A11 — So'rovlar. A list of requests beside one open conversation, the shape a support
   inbox already has: the admin keeps the queue in view while answering, instead of paging
   back and forth. Every management affordance the complaints table had survives — status
   is still set per request (now all three states in one control) and «Kartaga» still opens
   the user card; the thread is added beside them, it does not replace them.

   State lives here rather than in the row components so a reply, a status change and the
   selection all read from one source — the thread the admin is looking at is the same
   object the list row reflects. */
function RequestRow({ req, active, onClick }) {
  const u = foydalanuvchi(req.userId);
  const last = req.xabarlar[req.xabarlar.length - 1];
  const javobsiz = last && last.kim === 'user';
  return (
    <button type="button" onClick={onClick} style={{
      display:'flex', flexDirection:'column', gap:'var(--space-1)', width:'100%', textAlign:'left',
      padding:'var(--space-3)', border:'1px solid ' + (active ? 'var(--siyoh)' : 'var(--chegara)'),
      borderRadius:'var(--r-card)', background: active ? 'var(--karta-press)' : 'var(--karta)',
      cursor:'pointer', minWidth:0, transition:'border-color var(--tez) var(--ease)',
    }}>
      <span style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', width:'100%' }}>
        <span style={{ font:'var(--type-card-title)', flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {u ? u.ism : "O'chirilgan foydalanuvchi"}
        </span>
        <Badge tone={req.holat === 'yangi' ? 'ai' : 'neutral'}>{req.holat}</Badge>
      </span>
      <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', width:'100%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
        {last ? last.matn : ''}
      </span>
      <span style={{ display:'flex', alignItems:'center', gap:'var(--space-2)', font:'var(--type-badge)', color:'var(--matn-3)', fontVariantNumeric:'tabular-nums' }}>
        <span>{last ? last.vaqt.slice(0,10) : ''}</span>
        <span>·</span>
        <span>{req.xabarlar.length} xabar</span>
        {javobsiz && req.holat !== 'yopildi' && <React.Fragment><span>·</span><span style={{ color:'var(--matn-2)' }}>javob kutilmoqda</span></React.Fragment>}
      </span>
    </button>
  );
}

function RequestChat({ req, onReply, onHolat, openUser }) {
  const u = foydalanuvchi(req.userId);
  const [draft,setDraft] = React.useState('');
  const foot = React.useRef(null);
  // Keep the newest turn in view when the thread grows or another request is opened.
  React.useEffect(()=>{ if (foot.current) foot.current.parentElement.scrollTop = foot.current.parentElement.scrollHeight; },
    [req.userId, req.xabarlar.length]);
  const send = () => { const t = draft.trim(); if (!t) return; onReply(req.userId, t); setDraft(''); };
  return (
    <div style={{ display:'flex', flexDirection:'column', minWidth:0, height:'100%',
      background:'var(--karta)', border:'var(--hairline)', borderRadius:'var(--r-card)', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', padding:'var(--space-4)', borderBottom:'var(--hairline)' }}>
        <span style={{ display:'flex', flexDirection:'column', gap:2, flex:1, minWidth:0 }}>
          <span style={{ font:'var(--type-card-title)' }}>{u ? u.ism : "O'chirilgan foydalanuvchi"}</span>
          <span style={{ font:'var(--type-caption)', color:'var(--matn-2)', fontVariantNumeric:'tabular-nums' }}>
            {u ? 'TG ' + u.tgid + ' · ' + u.rol : 'foydalanuvchi topilmadi'}
          </span>
        </span>
        <Select value={req.holat} onChange={(v)=>onHolat(req.userId, v)} options={REQ_HOLAT} style={{ width:150 }}/>
        {u && <Button variant="tertiary" size="sm" onClick={()=>openUser(u)}>Kartaga</Button>}
      </div>
      <div style={{ flex:1, minHeight:0, overflowY:'auto', padding:'var(--space-4)',
        display:'flex', flexDirection:'column', gap:'var(--space-3)', background:'var(--fon)' }}>
        {req.xabarlar.map((m,i)=>{
          const mine = m.kim === 'admin';
          return (
            <span key={i} style={{ display:'flex', flexDirection:'column', gap:2, alignItems: mine ? 'flex-end' : 'flex-start' }}>
              <span style={{
                maxWidth:'78%', padding:'var(--space-3)', borderRadius:'var(--r-card)',
                background: mine ? 'var(--aksent)' : 'var(--karta)',
                color: mine ? 'var(--aksent-matn)' : 'var(--siyoh)',
                border: mine ? 'none' : 'var(--hairline)', font:'var(--type-body)',
              }}>{m.matn}</span>
              <span style={{ font:'var(--type-badge)', color:'var(--matn-3)', fontVariantNumeric:'tabular-nums' }}>
                {(mine ? 'admin' : (u ? u.ism : 'user')) + ' · ' + m.vaqt}
              </span>
            </span>
          );
        })}
        <span ref={foot}/>
      </div>
      {req.holat === 'yopildi' ? (
        <div style={{ padding:'var(--space-4)', borderTop:'var(--hairline)', font:'var(--type-caption)', color:'var(--matn-2)' }}>
          So'rov yopilgan. Javob yozish uchun holatni «ko'rildi» ga qaytaring.
        </div>
      ) : (
        <div style={{ display:'flex', alignItems:'flex-end', gap:'var(--space-3)', padding:'var(--space-4)', borderTop:'var(--hairline)' }}>
          <Textarea rows={2} value={draft} onChange={setDraft} placeholder="Javob yozing…" style={{ flex:1, minWidth:0 }}/>
          <Button onClick={send} disabled={!draft.trim()}>Yuborish</Button>
        </div>
      )}
    </div>
  );
}

function A11({ openUser }) {
  const [rows,setRows] = React.useState(sorovlar);
  const [openId,setOpenId] = React.useState(()=>{ const r = sorovlar(); return r[0] ? r[0].userId : null; });
  const current = rows.find(r=>r.userId === openId) || null;

  /* The store notifies on every write, including one made by the mobile app's «Yordam»
     chat in the same browser — so a message the user sends appears in the thread the admin
     already has open, without a refresh. */
  React.useEffect(()=>onSupportChange(()=>setRows(sorovlar())), []);

  const onHolat = (userId,holat) => { holatYozish(userId, holat); setRows(sorovlar()); };
  const onReply = (userId,matn) => { xabarQoshish(userId, 'admin', matn); setRows(sorovlar()); };

  return (
    <Page title="So'rovlar" caption="Har bir so'rov o'z foydalanuvchisi bilan alohida yozishma">
      {rows.length === 0 ? (
        <EmptyState icon="message-square" title="So'rov yo'q"/>
      ) : (
        <div data-admin-cols="" style={{ display:'grid', gridTemplateColumns:'minmax(260px,340px) minmax(0,1fr)',
          gap:'var(--card-gap)', height:620, minWidth:0 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)', overflowY:'auto', minWidth:0 }}>
            {rows.map(r=><RequestRow key={r.userId} req={r} active={r.userId === openId} onClick={()=>setOpenId(r.userId)}/>)}
          </div>
          {current && <RequestChat req={current} onReply={onReply} onHolat={onHolat} openUser={openUser}/>}
        </div>
      )}
    </Page>
  );
}

Object.assign(window, { A4, A5, A11, RequestRow, RequestChat });
