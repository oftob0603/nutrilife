/* Support conversations — ONE store, read and written by both surfaces.

   The mobile app's «Yordam» row and the admin panel's «So'rovlar» section are two views of
   the same thing, so neither owns the data. Threads are keyed by USER ID: that is what
   makes a conversation belong to a person rather than to a row, so the admin's reply
   reaches the user who wrote in, and a user's new message lands in the thread the admin
   already has open. Display names are never keys — two users can share one.

   Shape: { [userId]: { holat, xabarlar: [{ kim:'user'|'admin', vaqt, matn }] } }
   `holat` is the admin's triage state ('yangi' | "ko'rildi" | 'yopildi'); the user never
   sees it. Messages are oldest first, so the array IS the history.

   Both surfaces write through `xabarQoshish`, so a message can't be recorded without a
   timestamp and an author, and every write notifies listeners — the admin's open thread
   updates when the user sends something from the app in the same browser. */

const SUPPORT_KEY = 'nutrilife.support';

// The signed-in user in the prototype. PROFILE.ism is 'Aziz', i.e. USERS[0] in the admin
// panel — so the app's own «Yordam» thread genuinely resolves to a real user card there.
const MENING_ID = 1;

/* Sample conversations, so the admin panel does not open on an empty inbox. Keyed by the
   users these actually belong to: 3 Sardor, 5 Jasur, 2 Dilnoza. */
const SUPPORT_SEED = {
  3: { holat:'yangi', xabarlar:[
    { kim:'user', vaqt:'2026-09-10 09:14', matn:"Skan limitini ishlatmaganman, lekin tugadi deb turibdi" },
  ] },
  5: { holat:'yangi', xabarlar:[
    { kim:'user', vaqt:'2026-09-08 18:02', matn:"To'lov o'tdi, PRO ochilmadi" },
    { kim:'user', vaqt:'2026-09-08 18:05', matn:"Click orqali to'ladim, chek bor" },
  ] },
  2: { holat:"ko'rildi", xabarlar:[
    { kim:'user', vaqt:'2026-09-01 12:40', matn:"Somsa kaloriyasi noto'g'ri hisoblanyapti" },
    { kim:'admin', vaqt:'2026-09-01 15:10', matn:'Rahmat, bazadagi qiymatni tekshiramiz.' },
    { kim:'user', vaqt:'2026-09-02 08:22', matn:'Yaxshi, kutaman' },
  ] },
};

/* The admin panel previously kept threads under its own key, keyed by REQUEST id. Any
   replies already written there are real work, so they are carried over once rather than
   dropped: request 1/2/3 belonged to user 3/5/2. */
const LEGACY_KEY = 'nutrilife.admin.sorovlar';
const LEGACY_MAP = { 1:3, 2:5, 3:2 };

function supportRaw() {
  let saved = null;
  try { const v = JSON.parse(localStorage.getItem(SUPPORT_KEY) || 'null'); if (v && typeof v === 'object') saved = v; }
  catch (e) { saved = null; }

  if (!saved) {
    saved = {};
    try {
      const old = JSON.parse(localStorage.getItem(LEGACY_KEY) || 'null');
      if (old && typeof old === 'object') {
        Object.keys(old).forEach((reqId) => {
          const uid = LEGACY_MAP[reqId];
          const row = old[reqId];
          if (uid && row && Array.isArray(row.xabarlar)) {
            saved[uid] = { holat: row.holat || 'yangi', xabarlar: row.xabarlar };
          }
        });
      }
    } catch (e) {}
  }

  // Seed entries fill only the users with no saved thread, so sample content can never
  // overwrite a real conversation.
  const out = {};
  Object.keys(SUPPORT_SEED).forEach((uid) => { out[uid] = SUPPORT_SEED[uid]; });
  Object.keys(saved).forEach((uid) => { out[uid] = saved[uid]; });
  return out;
}

/* Re-entrancy guard. Listeners legitimately write in response to a change (opening the
   chat marks it seen), so a notification can re-enter this function. The idempotence
   checks in `belgilashKorildi` stop the ordinary case, but a guard here means no future
   listener can wedge the page by writing unconditionally — nested notifications are
   dropped, and the outermost one still delivers the final state. */
let notifying = false;

function supportWrite(all) {
  try { localStorage.setItem(SUPPORT_KEY, JSON.stringify(all)); } catch (e) {}
  supportNotify();
}

function supportNotify() {
  if (notifying) return;
  notifying = true;
  try { window.dispatchEvent(new CustomEvent('nutrilife:support')); } catch (e) {}
  finally { notifying = false; }
}

// Newest activity first: an inbox is ordered by what needs attention, not by user id.
function sorovlar() {
  const all = supportRaw();
  return Object.keys(all).map((uid) => ({
    userId: Number(uid),
    holat: all[uid].holat || 'yangi',
    xabarlar: all[uid].xabarlar || [],
  })).sort((a, b) => {
    const av = (a.xabarlar[a.xabarlar.length - 1] || {}).vaqt || '';
    const bv = (b.xabarlar[b.xabarlar.length - 1] || {}).vaqt || '';
    return av < bv ? 1 : av > bv ? -1 : 0;
  });
}

function sorov(userId) {
  const all = supportRaw();
  const r = all[userId];
  return { userId: Number(userId), holat: (r && r.holat) || 'yangi', xabarlar: (r && r.xabarlar) || [] };
}

function nowStamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}

function xabarQoshish(userId, kim, matn) {
  const t = String(matn || '').trim();
  if (!t) return null;
  const all = supportRaw();
  const r = all[userId] || { holat:'yangi', xabarlar:[] };
  const xabarlar = (r.xabarlar || []).concat([{ kim, vaqt: nowStamp(), matn: t }]);
  /* Status follows the last turn, so the admin's queue reflects reality without anyone
     maintaining it: an admin reply marks the request handled, and a new user message
     reopens it — including one that had been closed, since a person writing again is a
     live request, not a closed one. */
  const holat = kim === 'admin' ? "ko'rildi" : 'yangi';
  all[userId] = { holat, xabarlar };
  supportWrite(all);
  return all[userId];
}

function holatYozish(userId, holat) {
  const all = supportRaw();
  const r = all[userId] || { holat:'yangi', xabarlar:[] };
  all[userId] = { holat, xabarlar: r.xabarlar || [] };
  supportWrite(all);
  return all[userId];
}

/* Unread state, user side.

   Stored as the number of messages the user has already SEEN, not a boolean flag: the
   count survives several admin replies arriving before the user opens the chat (a flag
   would collapse them into one), and it cannot go stale if a message is added while the
   screen is open — the unread set is always «everything after index seen».

   Only admin turns count. The user's own messages are never unread to them. */
const SEEN_KEY = 'nutrilife.support.seen';

function seenMap() {
  try { const v = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}'); return v && typeof v === 'object' ? v : {}; }
  catch (e) { return {}; }
}

function oqilmagan(userId) {
  const t = sorov(userId);
  const seen = Number(seenMap()[userId] || 0);
  return t.xabarlar.slice(seen).filter(m => m.kim === 'admin').length;
}

// The newest unread admin message, for the notification's preview line.
function oqilmaganOxirgi(userId) {
  const t = sorov(userId);
  const seen = Number(seenMap()[userId] || 0);
  const yangi = t.xabarlar.slice(seen).filter(m => m.kim === 'admin');
  return yangi.length ? yangi[yangi.length - 1] : null;
}

function belgilashKorildi(userId) {
  const all = seenMap();
  const n = sorov(userId).xabarlar.length;
  // Idempotent, and silent when nothing changed. Listeners call this in response to the
  // very event a write emits, so an unconditional dispatch here re-enters forever.
  if (Number(all[userId] || 0) === n) return;
  all[userId] = n;
  try { localStorage.setItem(SEEN_KEY, JSON.stringify(all)); } catch (e) {}
  supportNotify();
}

// Cross-surface updates: same tab via the custom event, other tabs via `storage`.
function onSupportChange(fn) {
  const a = () => fn();
  const b = (e) => { if (e.key === SUPPORT_KEY || e.key === SEEN_KEY) fn(); };
  window.addEventListener('nutrilife:support', a);
  window.addEventListener('storage', b);
  return () => { window.removeEventListener('nutrilife:support', a); window.removeEventListener('storage', b); };
}

Object.assign(window, {
  SUPPORT_KEY, MENING_ID, SUPPORT_SEED, SEEN_KEY,
  sorovlar, sorov, xabarQoshish, holatYozish, onSupportChange,
  oqilmagan, oqilmaganOxirgi, belgilashKorildi,
});
