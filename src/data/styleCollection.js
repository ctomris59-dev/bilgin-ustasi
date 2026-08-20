export const STYLE_UNLOCK_XP = [0,100,200,300,450,600,750,900,1100,1300,1550,1800,2100,2400,2750,3100,3500,3900,4350,4800];

export const CHARACTER_STYLES = Object.freeze(STYLE_UNLOCK_XP.map((unlockXp,index)=>Object.freeze({
  id:`style-${String(index+1).padStart(2,"0")}`,
  index,
  number:index+1,
  label:`Karakter ${String(index+1).padStart(2,"0")}`,
  shortLabel:`K${String(index+1).padStart(2,"0")}`,
  unlockXp,
  description:index===0?"Bilgin Kaşif'in başlangıç görünümü.":`${unlockXp} XP'ye ulaştığında açılan tam kostüm görünümü.`,
})));

export const STYLE_BY_ID = Object.freeze(Object.fromEntries(CHARACTER_STYLES.map((style)=>[style.id,style])));
export const DEFAULT_STYLE_ID = "style-01";

export function getStyle(styleId){return STYLE_BY_ID[styleId]||STYLE_BY_ID[DEFAULT_STYLE_ID];}
export function isStyleUnlocked(styleOrId,xp=0){const style=typeof styleOrId==="string"?getStyle(styleOrId):styleOrId;return Number(xp||0)>=style.unlockXp;}
export function getUnlockedStyles(xp=0){return CHARACTER_STYLES.filter((style)=>isStyleUnlocked(style,xp));}
export function getUnlockedStyleCount(xp=0){return getUnlockedStyles(xp).length;}
export function getNextStyle(xp=0){return CHARACTER_STYLES.find((style)=>!isStyleUnlocked(style,xp))||null;}
export function normalizeStyleId(styleId,xp=0){const style=STYLE_BY_ID[styleId];return style&&isStyleUnlocked(style,xp)?style.id:DEFAULT_STYLE_ID;}
export function migrateLegacyStyle(avatar={},xp=0){
  if(STYLE_BY_ID[avatar?.styleId])return normalizeStyleId(avatar.styleId,xp);
  const legacyMap={explorer:"style-01",cloud:"style-02",forest:"style-03"};
  return normalizeStyleId(legacyMap[avatar?.set]||DEFAULT_STYLE_ID,xp);
}
export function makeStyleAvatar(styleId=DEFAULT_STYLE_ID,previous={},xp=0){
  return {characterStyle:"bilgin-master-v5",...previous,styleId:normalizeStyleId(styleId,xp)};
}
