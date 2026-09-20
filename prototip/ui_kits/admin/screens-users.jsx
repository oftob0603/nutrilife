// A2 users list, A3 user card
function A2({ openUser, loading }) {
  const [q,setQ] = React.useState('');
  const [filter,setFilter] = React.useState('Hammasi');
  const rows = USERS.filter(u=>{
    const okF = filter==='Hammasi' || (filter==='Bloklangan' ? u.rol==='Bloklangan' : u.rol===filter);
    const okQ = !q || (u.ism+u.tgid).toLowerCase().includes(q.toLowerCase());
    return okF && okQ;
  });
  return (
    <Page title="Foydalanuvchilar">
      <Toolbar>
        <SearchField style={{ flex:1, minWidth:280 }} value={q} onChange={setQ}
          placeholder="Telegram ID, ism yoki username"/>
        {['Hammasi','FREE','PRO','Bloklangan'].map(t=>(
          <Chip key={t} selected={filter===t} onClick={()=>setFilter(t)}>{t}</Chip>
        ))}
      </Toolbar>
      <DataTable loading={loading} onRowClick={openUser}
        columns={[
          { key:'ism', label:'Ism', width:'minmax(150px,1.6fr)' },
          { key:'tgid', label:'Telegram ID', width:'120px', numeric:true, muted:true },
          { key:'rol', label:'Rol', width:'116px', render:u=>(
            <Badge tone={u.rol==='PRO'?'ai':u.rol==='Bloklangan'?'error':'neutral'}>{u.rol}</Badge>) },
          { key:'obuna', label:'Obuna', width:'minmax(160px,1fr)', render:u=>u.obuna==='—'?'—':(u.obuna+' · '+u.tugash) },
          { key:'royxat', label:"Ro'yxatdan", width:'108px', numeric:true, muted:true },
          { key:'faollik', label:'Oxirgi faollik', width:'116px', muted:true },
          { key:'skan', label:'Skanlar', width:'84px', align:'right', numeric:true },
        ]}
        rows={rows}
        empty={<EmptyState icon="search-x" title={'«'+q+'» bo\'yicha foydalanuvchi topilmadi'}/>}
        footer={<><span>50 tadan 1–{rows.length}</span>
          <span style={{ display:'flex', gap:'var(--space-2)' }}>
            <Button variant="tertiary" size="sm" disabled>Oldingi</Button>
            <Button variant="tertiary" size="sm" disabled>Keyingi</Button>
          </span></>}/>
    </Page>
  );
}

function A3({ user, back }) {
  const [dialog,setDialog] = React.useState(null);
  const [tarif,setTarif] = React.useState('Oylik');
  const [muddat,setMuddat] = React.useState('1 oy');
  const [muddatlar,setMuddatlar] = React.useState(()=>royxat('muddat'));
  const [muddatDialog,setMuddatDialog] = React.useState(false);
  const [sabab,setSabab] = React.useState('');
  const [typed,setTyped] = React.useState('');
  const close = () => { setDialog(null); setSabab(''); setTyped(''); };
  return (
    <Page title={user.ism} caption={'Telegram ID ' + user.tgid}
      actions={<Button variant="tertiary" onClick={back}>Ro'yxatga qaytish</Button>}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--card-gap)' }}>
        <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
          <span style={{ font:'var(--type-card-title)' }}>Profil</span>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-3)' }}>
            <Field label="Ism">{user.ism}</Field>
            <Field label="Telegram ID">{user.tgid}</Field>
            <Field label="Til">{user.til}</Field>
            <Field label="Ro'yxatdan o'tgan">{user.royxat}</Field>
            <Field label="Rol"><Badge tone={user.rol==='PRO'?'ai':user.rol==='Bloklangan'?'error':'neutral'}>{user.rol}</Badge></Field>
          </div>
        </Card>
        <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
          <span style={{ font:'var(--type-card-title)' }}>Obuna</span>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-3)' }}>
            <Field label="Holat">{user.rol==='PRO'?'Faol':'Yo\'q'}</Field>
            <Field label="Tarif">{user.obuna}</Field>
            <Field label="Tugash sanasi">{user.tugash}</Field>
            <Field label="Manba">{user.manba==='qolda'
              ? <Badge tone="neutral">qo'lda berilgan</Badge>
              : user.manba==='tolov' ? "to'lov" : '—'}</Field>
          </div>
          {user.manba==='qolda' && <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
            Qo'lda berilgan obuna daromad statistikasiga kirmaydi
          </span>}
        </Card>
      </div>
      <Card style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
        <span style={{ font:'var(--type-card-title)' }}>Faollik</span>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'var(--space-3)' }}>
          <Field label="Jami skanlar">{son(user.skan)}</Field>
          <Field label="Qolgan limit">{user.rol==='PRO'?'cheksiz':'3 / 3'}</Field>
          <Field label="Oxirgi faollik">{user.faollik}</Field>
        </div>
        <DataTable
          columns={[
            { key:'sana', label:'Sana', width:'140px', muted:true, numeric:true },
            { key:'taom', label:'Ovqat yozuvi', width:'minmax(0,2fr)' },
            { key:'kkal', label:'kkal', width:'90px', align:'right', numeric:true },
          ]}
          rows={[
            { id:1, sana:'13.09 08:20', taom:'Obi non, 100 g', kkal:262 },
            { id:2, sana:'13.09 13:05', taom:'Osh, 300 g', kkal:630 },
            { id:3, sana:'12.09 19:40', taom:'Achichuk, 120 g', kkal:46 },
          ]}/>
      </Card>
      <Toolbar>
        <Button variant="primary" onClick={()=>setDialog('pro')}>PRO berish</Button>
        <Button variant="secondary" onClick={()=>setDialog('uzaytirish')}>Muddatni uzaytirish</Button>
        <Button variant="secondary" onClick={()=>setDialog('olib')}>PRO ni olib qo'yish</Button>
        <Button variant="secondary" onClick={()=>setDialog('blok')}>Bloklash</Button>
        <Button variant="tertiary" onClick={()=>setDialog('ochirish')} style={{ color:'var(--xato)' }}>Ma'lumotini o'chirish</Button>
      </Toolbar>

      <Modal open={dialog==='pro'} onClose={close} title="PRO berish"
        description="Qo'lda berilgan obuna daromad statistikasiga kirmaydi — manba «qo'lda» deb belgilanadi."
        confirmLabel="PRO berish" confirmDisabled={!sabab.trim()} onConfirm={close}>
        {/* Tariffs ARE the Narxlar rows — a new one is a priced product created there,
            not a name typed into a dropdown, so no create row. */}
        <Select label="Tarif" value={tarif} onChange={setTarif}
          options={['Oylik','6 oylik','Yillik','Boshqa muddat']}/>
        <Textarea label="Sabab" required rows={3} value={sabab} onChange={setSabab}
          hint="Masalan: test, kompensatsiya, sovg'a"/>
      </Modal>

      <Modal open={dialog==='uzaytirish'} onClose={close} title="Muddatni uzaytirish"
        description={'Joriy tugash sanasi: ' + user.tugash}
        confirmLabel="Uzaytirish" confirmDisabled={!sabab.trim()} onConfirm={close}>
        <Select label="Qancha muddatga" value={muddat} onChange={setMuddat} options={muddatlar}
          createLabel="Yangi qo'shish" onCreate={()=>setMuddatDialog(true)}/>
        <Textarea label="Sabab" required rows={2} value={sabab} onChange={setSabab}/>
      </Modal>
      <RoyxatDialog open={muddatDialog} onClose={()=>setMuddatDialog(false)} list="muddat"
        title="Yangi muddat"
        description="Muddat barcha uzaytirish oynalarida darhol paydo bo'ladi."
        label="Muddat" onAdded={(t)=>{ setMuddatlar(royxat('muddat')); setMuddat(t); }}/>

      <Modal open={dialog==='olib'} onClose={close} danger title="PRO ni olib qo'yish"
        description="Obuna darhol to'xtaydi va foydalanuvchi FREE limitlariga qaytadi."
        confirmLabel="Olib qo'yish" confirmDisabled={!sabab.trim()} onConfirm={close}>
        <Textarea label="Sabab" required rows={2} value={sabab} onChange={setSabab}/>
      </Modal>

      <Modal open={dialog==='blok'} onClose={close} title="Bloklash"
        description="Kirish yopiladi, ma'lumot joyida qoladi. Blokni keyin yechish mumkin."
        confirmLabel="Bloklash" confirmDisabled={!sabab.trim()} onConfirm={close}>
        <Textarea label="Sabab" required rows={2} value={sabab} onChange={setSabab}/>
      </Modal>

      <Modal open={dialog==='ochirish'} onClose={close} danger title="Ma'lumotini o'chirish"
        description="Profil, jurnal va rasmlar butunlay o'chadi. Bu amalni qaytarib bo'lmaydi."
        confirmLabel="O'chirish" confirmDisabled={typed!==user.ism || !sabab.trim()} onConfirm={close}>
        <Input label={'Tasdiqlash uchun «' + user.ism + '» deb yozing'} value={typed} onChange={setTyped}/>
        <Textarea label="Sabab" required rows={2} value={sabab} onChange={setSabab}/>
      </Modal>
    </Page>
  );
}

Object.assign(window, { A2, A3 });
