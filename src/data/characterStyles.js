// V5.0 — Bilgin Kaşif 20 tam görünüm koleksiyonu.
// Parça giydirme yok: her stil aynı karakterin 1024×1536 tam renderıdır.

export const STYLE_UNLOCK_STEP = 250;

const definitions = [
  ["style-01","Klasik Kaşif","Kaşif","01-kasif.avif",0,"Başlangıç görünümü"],
  ["style-02","Bilim Kaşifi","Bilim","02-bilim.avif",250,"Deney ve keşif ruhu"],
  ["style-03","Galaksi Kaşifi","Galaksi","03-galaksi.avif",500,"Yıldızların ötesine yolculuk"],
  ["style-04","Orman Kaşifi","Orman","04-orman.avif",750,"Doğa ve iz sürme ustası"],
  ["style-05","Buz Kristali","Buz","05-buz.avif",1000,"Kristal soğuğun kahramanı"],
  ["style-06","Ateş Maceracısı","Ateş","06-ates.avif",1250,"Alev enerjili keşif seti"],
  ["style-07","Deniz Kaşifi","Deniz","07-deniz.avif",1500,"Okyanusların araştırmacısı"],
  ["style-08","Kraliyet Kaşifi","Kraliyet","08-kraliyet.avif",1750,"Altın detaylı seçkin görünüm"],
  ["style-09","Siber Kaşif","Siber","09-siber.avif",2000,"Neon teknolojinin ustası"],
  ["style-10","Altın Efsane","Altın","10-altin.avif",2250,"Efsanevi altın keşif görünümü"],
  ["style-11","Çöl Kaşifi","Çöl","11-col.avif",2500,"Kum fırtınalarına hazır"],
  ["style-12","Vahşi Orman","Vahşi Orman","12-vahsi-orman.avif",2750,"Derin ormanların koruyucusu"],
  ["style-13","Sakura Kaşifi","Sakura","13-sakura.avif",3000,"Bahar çiçekleriyle keşif"],
  ["style-14","Elektrik Kaşifi","Elektrik","14-elektrik.avif",3250,"Yüksek voltajlı enerji seti"],
  ["style-15","Gölge Kaşifi","Gölge","15-golge.avif",3500,"Gizemli gece görevlisi"],
  ["style-16","Mühendis Kaşif","Mühendis","16-muhendis.avif",3750,"Mekanik icatların ustası"],
  ["style-17","Prizma Kaşifi","Prizma","17-prizma.avif",4000,"Renk ve kristal enerjisi"],
  ["style-18","Kutup Yıldızı","Kutup","18-kutup-yildizi.avif",4250,"Kuzey ışıklarının rehberi"],
  ["style-19","Sonbahar Kaşifi","Sonbahar","19-sonbahar.avif",4500,"Sıcak sonbahar tonları"],
  ["style-20","Ay Yıldızı Efsanesi","Ay Yıldızı","20-ay-yildiz.avif",4750,"Koleksiyonun final efsane görünümü"],
];

export const CHARACTER_STYLES = Object.freeze(definitions.map(([id,label,shortLabel,file,unlockXp,description], index) => Object.freeze({
  id,label,shortLabel,file,unlockXp,description,index:index+1,
  image:`/character-styles/${file}`,
  width:1024,height:1536,aspectRatio:"2:3",
})));

export const STYLE_BY_ID = Object.freeze(Object.fromEntries(CHARACTER_STYLES.map((style)=>[style.id,style])));
export const DEFAULT_STYLE_ID = "style-01";
export const DEFAULT_STYLE = STYLE_BY_ID[DEFAULT_STYLE_ID];

export function getUnlockedStyles(xp=0){return CHARACTER_STYLES.filter((style)=>Number(xp||0)>=style.unlockXp);}
export function isStyleUnlocked(styleId,xp=0){const style=STYLE_BY_ID[styleId];return Boolean(style&&Number(xp||0)>=style.unlockXp);}
export function getStyleProgress(styleId,xp=0){const style=STYLE_BY_ID[styleId]||DEFAULT_STYLE;if(Number(xp||0)>=style.unlockXp)return 100;return Math.max(0,Math.min(100,Math.round((Number(xp||0)/Math.max(1,style.unlockXp))*100)));}
export function normalizeStyleId(styleId,xp=0){if(isStyleUnlocked(styleId,xp))return styleId;const unlocked=getUnlockedStyles(xp);return unlocked.at(-1)?.id||DEFAULT_STYLE_ID;}
