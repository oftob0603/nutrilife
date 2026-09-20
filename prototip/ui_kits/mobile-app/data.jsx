const FOODS = [
  { id:'osh', name:'Osh', per:100, kcal:186, p:6.4, fat:8.1, c:22, portions:[150,250,350] },
  { id:'manti', name:'Manti', per:1, unit:'dona', kcal:210, p:9.2, fat:9.8, c:22.4, portions:[1,2,3] },
  { id:'somsa', name:'Somsa', per:1, unit:'dona', kcal:310, p:11.4, fat:17.2, c:27, portions:[1,2] },
  { id:'lagman', name:'Lagmon', per:100, kcal:132, p:5.8, fat:4.9, c:16.2, portions:[250,350,450] },
  { id:'shurpa', name:"Sho'rva", per:100, kcal:78, p:4.1, fat:3.6, c:7.2, portions:[250,350] },
  { id:'non', name:'Obi non', per:1, unit:'bo\'lak', kcal:142, p:4.4, fat:1.1, c:28.6, portions:[1,2] },
  { id:'chuchvara', name:'Chuchvara', per:100, kcal:198, p:8.6, fat:8.2, c:22.1, portions:[200,300] },
  { id:'norin', name:'Norin', per:100, kcal:174, p:11.2, fat:7.4, c:16.8, portions:[150,250] },
];

const START_ENTRIES = [
  { id:1, food:'Obi non', portion:"2 bo'lak", time:'08:20', kcal:284, p:8.8, fat:2.2, c:57.2, meal:'Nonushta', ai:false },
  { id:2, food:"Sho'rva", portion:'350 g', time:'13:05', kcal:273, p:14.4, fat:12.6, c:25.2, meal:'Tushlik', ai:true },
  { id:3, food:'Somsa', portion:'1 dona', time:'16:40', kcal:310, p:11.4, fat:17.2, c:27, meal:'Gazak', ai:true },
];

/* The daily target. Seed values for the standalone kit, which has no onboarding to ask;
   the prototype shell overwrites them from the user's real answers before mount, and
   recording a weight or editing personal info recomputes them in place. Mutable on
   purpose — the screens read it as a module global. */
const GOALS = { kcal:2190, p:120, fat:70, c:240 };
const MEALS = ['Nonushta','Tushlik','Kechki','Gazak'];
// `fmt` comes from ../shared/plan.js — one formatter for every kit.

Object.assign(window, { FOODS, START_ENTRIES, GOALS, MEALS });
