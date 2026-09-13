# SAVALA — Kalori

## Raund: 2026-09-13

**Panel:** 6 doimiy + 🎭 CTO / arxitektor (chaqirildi, chunki DECISIONS.md'da 1-xavf
"AI o'zbek taomini tanimaydi" deb yozilgan — butun qiymat taklifi tekshirilmagan
texnik garovga tikilgan).

### Yopilgan e'tirozlar

- **Reklamadan kelgan odam 3 skandan keyin ketadi** -> FREE limiti o'zgartirildi:
  umr davomida jami 3 ta emas, **kuniga 1 ta bepul skan**.
- **ChatGPT bepul javob beradi, nega pulli ilova?** -> Farq doimiy shaxsiy monitoring
  va retseptlar kutubxonasida; ChatGPT kunlik jurnal va xotira tutmaydi.
- **Kunlik operatsion yuk juda og'ir** -> To'lov API orqali avtomatik tasdiqlanadi va
  PRO o'zi faollashadi; qo'lda faqat retsept kiritish qoladi.
- **Maxfiylik va javobgarlik yuki** -> Telefon va email umuman olinmaydi. Terms'da:
  18+, tibbiy ilova emas, kasallik holatida shifokor bilan maslahatlashish tavsiyasi,
  foydalanish ixtiyoriy, ilova faqat taxminiy kaloriya o'lchaydi va retsept tavsiya
  qiladi, oqibatlar uchun javobgar emas.
- **Rasmdan porsiya og'irligini baholash ishonchsiz** -> Foydalanuvchi ovqat vaznini
  va qo'shimcha ma'lumotni o'zi kiritib aniqroq natija olishi mumkin.

### Ochiq xavflar

- **AI aniqligi o'lchanmagan** — model oshni shavladan, mantini chuchvaradan
  ajratadimi, noma'lum. *Qachon:* S1'dan OLDIN, bir kunlik test bilan.
- **Birlik iqtisodiyoti hisoblanmagan** — 39 000 so'm narxi tannarx hisobidan emas,
  taxminan qo'yilgan. Kunlik 1 ta bepul skan qarori bepul foydalanuvchi xarajatini
  oyiga ~30 chaqiruvga oshirdi. *Qachon:* AI testi bilan bir vaqtda, o'sha chaqiruvlar
  narxi bo'yicha.
- **Ma'lumot joylashuvi (data residency)** — STACK'da server Hetzner (Germaniya),
  ovqat rasmlari doimiy saqlanadi. O'zbekistonda shaxsiy ma'lumotni mahalliy bazada
  qayta ishlash talabi bor-yo'qligi tekshirilmagan. Cloudflare — himoya, joylashuv emas.
  *Qachon:* Click/Payme shartnomasidan oldin, S5.
- **Talab dalili bilvosita** — hech kim o'zi "bilmayman, bu meni qiynaydi" demagan;
  signal raqobatchi ilovalardagi faollikdan olingan. *Qachon:* S1 jonli chiqqach,
  birinchi 20 foydalanuvchi bilan suhbat.
- **Yurak amal ikki xil o'qiladi** — "ko'rish" (doiraga qarash) yoki "qo'shish"
  (ovqat kiritish). Bildirishnoma strategiyasi va retention o'lchovi shunga bog'liq.
  *Qachon:* S1 analitikasi, qaysi harakat ko'proq takrorlanishini o'lchash.
- **Taom takliflari moderatsiyasi egasiz** — 1000 foydalanuvchida navbatni kim va
  qanchalik tez-tez yopadi, aytilmagan. *Qachon:* S6.

### Ovozlar

| Ekspert | Ovoz | Sabab |
|---|---|---|
| 🔍 Bozor tahlilchisi | ⚠️ SHARTLI | Dalil bilvosita — hech kim o'zi aytmagan |
| 💰 VC tanqidchi | ❌ NO-GO | Birlik iqtisodiyoti ataylab kechiktirildi |
| 😈 Advokat dyavola | ⚠️ SHARTLI | Yurak amal ziddiyati yopilmadi |
| 📣 O'sish marketologi | ✅ GO | Kunlik 1 bepul skan — ishlaydigan mexanizm |
| ⚙️ Operatsion direktor | ⚠️ SHARTLI | To'lov avtomatlashdi, moderatsiya egasi yo'q |
| ⚖️ Yurist-riskchi | ⚠️ SHARTLI | Ma'lumot minimal — kuchli; joylashuv ochiq |
| 🎭 CTO / arxitektor | ❌ NO-GO | AI aniqligi o'lchanmagan |

**Natija:** GO 1 · SHARTLI 4 · NO-GO 2

### Qaror

**SHARTLI GO** — uch shart bajarilsa yo'lga chiqiladi:

1. **AI aniqlik testi S1'dan oldin.** 20 ta haqiqiy o'zbek taomi rasmi (osh, shavla,
   manti, chuchvara, somsa, lag'mon, norin, dimlama va boshqalar) ikki-uch vision
   modelga tashlanadi. O'lchanadigan narsa: taomni to'g'ri nomlash ulushi va porsiya
   og'irligidagi xato. Natija yomon bo'lsa — mahsulot "AI taniydi" dan "foydalanuvchi
   tanlaydi, AI yordam beradi" ga qarab siljiydi.
2. **Bitta skan tannarxi o'lchanadi.** Yuqoridagi test paytida chaqiruvlar narxi
   ko'rinadi. 39 000 so'm oylik narx shu raqam bilan solishtiriladi: PRO kuniga 20 ta,
   FREE kuniga 1 ta.
3. **Ma'lumot joylashuvi bo'yicha huquqiy tekshiruv.** Ovqat rasmlari shaxsiy ma'lumot
   hisoblanadimi va ular O'zbekiston hududida saqlanishi shartmi — Click/Payme
   shartnomasidan oldin aniqlanadi.

### Keyingi qadamlar

1. AI aniqlik testi — S1'dan oldin, bir kunlik ish
2. Skan tannarxi va narx solishtiruvi — test bilan bir vaqtda
3. Huquqiy tekshiruv (data residency) — S5, to'lovdan oldin
4. S1 analitikasi: "doiraga qarash" va "ovqat qo'shish" harakatlarini alohida o'lchash
5. Birinchi 20 foydalanuvchi bilan suhbat — S1 jonli chiqqandan keyin

---

*Kalori · vibecoding plugin bilan yaratilgan · vibecoding.uz*
