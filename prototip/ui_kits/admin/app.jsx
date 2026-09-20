function A0({ onLogin, denied }) {
  return (
    <div style={{
      minWidth:'var(--admin-min)', height:820, background:'var(--fon)',
      border:'var(--hairline)', borderRadius:'var(--r-card)',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <Card style={{ width:400, maxWidth:'100%', display:'flex', flexDirection:'column', gap:'var(--space-4)', alignItems:'flex-start' }}>
        <span style={{ font:'var(--type-screen-title)', fontFamily:'var(--font-display)', letterSpacing:'var(--ls-ring)' }}>NutriLife</span>
        {denied ? (
          <>
            <span style={{ font:'var(--type-body)' }}>Bu sahifaga ruxsatingiz yo'q</span>
            <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
              Panel tuzilishi va bo'lim nomlari ko'rsatilmaydi. Har so'rovda rol serverda qayta tekshiriladi.
            </span>
          </>
        ) : (
          <>
            <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>/admin</span>
            <Button variant="primary" full onClick={onLogin}>
              <Icon name="send" size={18}/> Telegram orqali kirish
            </Button>
            <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
              Telegram Login Widget · server imzoni tekshiradi va rolni qaraydi
            </span>
          </>
        )}
      </Card>
    </div>
  );
}

function AdminApp() {
  const [authed,setAuthed] = React.useState(false);
  const [denied,setDenied] = React.useState(false);
  const [section,setSection] = React.useState('a1');
  const [user,setUser] = React.useState(null);
  const [sug,setSug] = React.useState(null);
  const [dish,setDish] = React.useState(undefined);
  const [recipe,setRecipe] = React.useState(undefined);
  const [loading,setLoading] = React.useState(false);
  const [emptyQueue,setEmptyQueue] = React.useState(false);

  const go = (s) => { setSection(s); setUser(null); setSug(null); setDish(undefined); setRecipe(undefined); };
  const openUser = (u) => { setSection('a2'); setUser(u); };

  let body;
  if (user) body = <A3 user={user} back={()=>setUser(null)}/>;
  else if (sug) body = <A5 item={sug} back={()=>setSug(null)}/>;
  else if (dish !== undefined) body = <A7 dish={dish} back={()=>setDish(undefined)}/>;
  else if (recipe !== undefined) body = <A9 recipe={recipe} back={()=>setRecipe(undefined)}/>;
  else body = {
    a1: <A1 go={go} loading={loading}/>,
    a2: <A2 openUser={openUser} loading={loading}/>,
    a4: <A4 openSuggestion={setSug} emptyQueue={emptyQueue}/>,
    a6: <A6 openDish={setDish}/>,
    a8: <A8 openRecipe={setRecipe}/>,
    a10: <A10/>,
    a11: <A11 openUser={openUser}/>,
    a12: <A12/>,
  }[section];

  return (
    <div style={{ position:'relative' }}>
      {authed ? <Shell section={section} onSection={go}>{body}</Shell> : <A0 denied={denied} onLogin={()=>setAuthed(true)}/>}
      <div data-admin-note="" style={{
        position:'absolute', top:0, right:-244, width:220,
        background:'var(--karta)', border:'var(--hairline)',
        borderRadius:'var(--r-card)', padding:'var(--card-padding)',
        display:'flex', flexDirection:'column', gap:'var(--space-3)',
        boxShadow:'var(--shadow-float)',
      }}>
        <span style={{ font:'var(--type-card-title)' }}>Holatlar</span>
        <Chip selected={!authed && !denied} onClick={()=>{setAuthed(false);setDenied(false);}}>A0 kirish</Chip>
        <Chip selected={!authed && denied} onClick={()=>{setAuthed(false);setDenied(true);}}>A0 rad javobi</Chip>
        <Chip selected={authed} onClick={()=>setAuthed(true)}>Panel</Chip>
        <div style={{ height:1, background:'var(--chegara)' }}/>
        <Chip selected={loading} onClick={()=>setLoading(v=>!v)}>Yuklanmoqda (A1, A2)</Chip>
        <Chip selected={emptyQueue} onClick={()=>setEmptyQueue(v=>!v)}>Bo'sh navbat (A4)</Chip>
        <div style={{ height:1, background:'var(--chegara)' }}/>
        <span style={{ font:'var(--type-caption)', color:'var(--matn-2)' }}>
          Jadval qatorini bosing — A3 foydalanuvchi kartasi, A5 taklif, A7 taom, A9 retsept ochiladi.
        </span>
      </div>
    </div>
  );
}
