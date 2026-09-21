/**
 * Taom rasmlarining mualliflari va litsenziyalari — yagona manba. "Rasm mualliflari" sahifasi
 * (app/profil/mualliflar) shuni ko'rsatadi: CC BY / BY-SA nom, muallif, manba va litsenziyani
 * ko'rsatishni talab qiladi. `public/taomlar/` ga rasm qo'shilsa yoki almashtirilsa, shu
 * ro'yxat ham yangilanadi.
 */

export type Litsenziya = "CC BY 2.0" | "CC BY 3.0" | "CC BY 4.0" | "CC BY-SA 2.0" | "CC BY-SA 2.5" | "CC BY-SA 4.0" | "CC0";

export type RasmMuallifi = {
  /** `public/taomlar/` ichidagi fayl nomi. */
  fayl: string;
  /** Wikimedia Commons'dagi asl rasm nomi. */
  nomi: string;
  manba: string;
  muallif: string;
  litsenziya: Litsenziya;
};

export const LITSENZIYA_HAVOLALARI: Record<Litsenziya, string> = {
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
  "CC BY-SA 2.5": "https://creativecommons.org/licenses/by-sa/2.5/",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
  "CC0": "https://creativecommons.org/publicdomain/zero/1.0/",
};

export const RASM_MUALLIFLARI: readonly RasmMuallifi[] = [
  {
    fayl: "ayron.webp",
    nomi: "Ayran in a beer glass.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Ayran_in_a_beer_glass.jpg",
    muallif: "E4024",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "achchiq-chuchuk.webp",
    nomi: "Kachumbari.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Kachumbari.jpg",
    muallif: "Charles Haynes",
    litsenziya: "CC BY-SA 2.0",
  },
  {
    fayl: "bahor-salati.webp",
    nomi: "Cucumber, Radishes, Mint & Feta Salad (8395667977).jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Cucumber,_Radishes,_Mint_%26_Feta_Salad_(8395667977).jpg",
    muallif: "Cajsa Lilliehook from Portland",
    litsenziya: "CC BY-SA 2.0",
  },
  {
    fayl: "dimlama.webp",
    nomi: "Dimlama (16425713838).jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Dimlama_(16425713838).jpg",
    muallif: "mismailovs from West Lafayette, US",
    litsenziya: "CC BY 2.0",
  },
  {
    fayl: "gumma.webp",
    nomi: "Gumma001.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Gumma001.jpg",
    muallif: "Panpanchik",
    litsenziya: "CC BY 4.0",
  },
  {
    fayl: "guruch.webp",
    nomi: "Boiled rice in a bowl.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Boiled_rice_in_a_bowl.jpg",
    muallif: "Afifa Afrin",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "halim.webp",
    nomi: "Halim taomi.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Halim_taomi.jpg",
    muallif: "Ahmedovabror655",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "hasip.webp",
    nomi: "Hasip.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Hasip.jpg",
    muallif: "Mahufi",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "lagman.webp",
    nomi: "Laghman, Novosibirsk 01.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Laghman,_Novosibirsk_01.jpg",
    muallif: "К.Артём.1",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "manti.webp",
    nomi: "Uzbek Manti (bright).jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Uzbek_Manti_(bright).jpg",
    muallif: "Ramón from Llanera, España ; brightened by Off-shell",
    litsenziya: "CC BY-SA 2.0",
  },
  {
    fayl: "mastava.webp",
    nomi: "Суп Мастава.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:%D0%A1%D1%83%D0%BF_%D0%9C%D0%B0%D1%81%D1%82%D0%B0%D0%B2%D0%B0.jpg",
    muallif: "Olexdj",
    litsenziya: "CC0",
  },
  {
    fayl: "mosh-kichiri.webp",
    nomi: "Moshkichra.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Moshkichra.jpg",
    muallif: "Behruznurullayevv",
    litsenziya: "CC0",
  },
  {
    fayl: "non.webp",
    nomi: "Uzbek bread (Nonvoy non).jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Uzbek_bread_(Nonvoy_non).jpg",
    muallif: "Shvann",
    litsenziya: "CC0",
  },
  {
    fayl: "norin.webp",
    nomi: "Naryn tashkent 2024.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Naryn_tashkent_2024.jpg",
    muallif: "Прикли",
    litsenziya: "CC BY 4.0",
  },
  {
    fayl: "olivye.webp",
    nomi: "2023 Sałatka jarzynowa (1).jpg",
    manba: "https://commons.wikimedia.org/wiki/File:2023_Sa%C5%82atka_jarzynowa_(1).jpg",
    muallif: "Jacek Halicki",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "osh.webp",
    nomi: "Samarkan Pilaf.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Samarkan_Pilaf.jpg",
    muallif: "Muzaffar Murodovich",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "patir.webp",
    nomi: "Qo'qon patir.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Qo%27qon_patir.jpg",
    muallif: "Iammuhammadiso",
    litsenziya: "CC0",
  },
  {
    fayl: "qatiq.webp",
    nomi: "Qatiq from Azerbaijan.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Qatiq_from_Azerbaijan.jpg",
    muallif: "Irada",
    litsenziya: "CC BY 3.0",
  },
  {
    fayl: "qatlama.webp",
    nomi: "Turkish katmer.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Turkish_katmer.jpg",
    muallif: "E4024",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "qovurdoq.webp",
    nomi: "Kazakh quwyrdaq.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Kazakh_quwyrdaq.jpg",
    muallif: "Rio Murr from Minsk, Belarus",
    litsenziya: "CC BY-SA 2.0",
  },
  {
    fayl: "qozonkabob.webp",
    nomi: "Kazan-kebab in Drohobych, Ukraine 02.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Kazan-kebab_in_Drohobych,_Ukraine_02.jpg",
    muallif: "MarianaSenkiv",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "somsa.webp",
    nomi: "Uzbek samsa in Vienna, Austria.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Uzbek_samsa_in_Vienna,_Austria.jpg",
    muallif: "Nurken",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "sumalak.webp",
    nomi: "Samanu 05.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Samanu_05.jpg",
    muallif: "Maryam Davarnia",
    litsenziya: "CC BY 4.0",
  },
  {
    fayl: "suzma.webp",
    nomi: "Labneh (5196911587).jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Labneh_(5196911587).jpg",
    muallif: "Leslie Seaton from Seattle, WA, USA",
    litsenziya: "CC BY 2.0",
  },
  {
    fayl: "tandir-kabob.webp",
    nomi: "Тандыр-кабоб.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:%D0%A2%D0%B0%D0%BD%D0%B4%D1%8B%D1%80-%D0%BA%D0%B0%D0%B1%D0%BE%D0%B1.jpg",
    muallif: "SmartSer",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "tok-dolma.webp",
    nomi: "Liat Portal for Foodie Disorder - Stuffed grape leaves (dolma) from San Francisco farmers market.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Liat_Portal_for_Foodie_Disorder_-_Stuffed_grape_leaves_(dolma)_from_San_Francisco_farmers_market.jpg",
    muallif: "HaJunkiyada",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "tovuq-shorva.webp",
    nomi: "Liat Portal for Foodie Disorder - Chicken Soup with Rice Noodles.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Liat_Portal_for_Foodie_Disorder_-_Chicken_Soup_with_Rice_Noodles.jpg",
    muallif: "HaJunkiyada",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "tuxum.webp",
    nomi: "Boiled Egg - Crossection.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Boiled_Egg_-_Crossection.jpg",
    muallif: "Ramesh NG",
    litsenziya: "CC BY-SA 2.0",
  },
  {
    fayl: "tuxum-barak.webp",
    nomi: "Tukhum Barak.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Tukhum_Barak.jpg",
    muallif: "PolarMishka",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "vinegret.webp",
    nomi: "Vinegret cleaned.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Vinegret_cleaned.jpg",
    muallif: "Loyna (original image) ; processed by Off-shell",
    litsenziya: "CC BY-SA 2.5",
  },
  {
    fayl: "xonim.webp",
    nomi: "Oromo dish with spoon and fork.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Oromo_dish_with_spoon_and_fork.jpg",
    muallif: "Абдырашит Сатылганов",
    litsenziya: "CC0",
  },
  {
    fayl: "shashlik-mol.webp",
    nomi: "Shashlik-national food of Uzbekistan.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Shashlik-national_food_of_Uzbekistan.jpg",
    muallif: "Muharramxon",
    litsenziya: "CC BY 4.0",
  },
  {
    fayl: "shashlik-tovuq.webp",
    nomi: "Chicken suslik.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Chicken_suslik.jpg",
    muallif: "Twilightin",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "shurpa.webp",
    nomi: "Chorba cooked in the home kitchen.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Chorba_cooked_in_the_home_kitchen.jpg",
    muallif: "Bgelo777",
    litsenziya: "CC BY-SA 4.0",
  },
  {
    fayl: "chuchvara.webp",
    nomi: "Dushbara in broth.jpg",
    manba: "https://commons.wikimedia.org/wiki/File:Dushbara_in_broth.jpg",
    muallif: "C980040",
    litsenziya: "CC BY-SA 4.0",
  },
];
