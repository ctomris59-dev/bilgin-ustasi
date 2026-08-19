import { useMemo, useState } from "react";
import { ITEMS, SETS, SET_LOADOUTS } from "../../data/avatarParts";
import { getCatalogMeta } from "../../data/catalog";
import { getCharacterSetAsset, CHARACTER_PRESETS } from "../../data/gameAssets";
import { playPop } from "../../lib/sound";

const SLOT_TABS=[["outfit","Kıyafet","👕"],["shoes","Ayakkabı","👢"],["headwear","Başlık","🧢"],["face","Aksesuar","◉"],["back","Sırt","🎒"]];
const SET_ORDER=["explorer","cloud","forest"];
const FALLBACK={explorer:CHARACTER_PRESETS.explorer,cloud:CHARACTER_PRESETS.cloud,forest:CHARACTER_PRESETS.forest};

function SafeSetImage({setId,className="",alt=""}){
  return <img className={className} src={getCharacterSetAsset(setId)} alt={alt} onError={(e)=>{if(e.currentTarget.dataset.fallback)return;e.currentTarget.dataset.fallback="1";e.currentTarget.src=FALLBACK[setId]||FALLBACK.explorer;}}/>;
}

export default function ShopHub({profile,onBuyItem}){
  const [slot,setSlot]=useState("outfit");
  const owned=useMemo(()=>new Set(profile.unlockedItems||[]),[profile.unlockedItems]);
  const items=useMemo(()=>ITEMS.filter((item)=>item.slot===slot).map(getCatalogMeta),[slot]);
  const setOwned=(setId)=>Object.values(SET_LOADOUTS[setId]||{}).every((id)=>owned.has(id));
  function buySet(setId){const first=ITEMS.find((item)=>item.set===setId);if(first){playPop();onBuyItem?.(first);}}
  return <section className="v493-shop-page v47-panel">
    <header className="v493-shop-header"><div><span>DÜKKAN</span><h1>Kaşif Koleksiyonları</h1><p>Karakterin için hazırlanmış tam setleri keşfet. Her set beş parçayı birlikte açar.</p></div><div className="v493-shop-wallet"><b>{profile.coins||0}</b><small>COIN</small></div></header>
    <div className="v47-slot-tabs v493-shop-tabs">{SLOT_TABS.map(([id,label,icon])=><button key={id} className={slot===id?"is-active":""} onClick={()=>setSlot(id)}><span>{icon}</span>{label}</button>)}</div>
    <div className="v493-shop-layout">
      <div className="v493-shop-items">{items.map((item)=>{const set=SETS[item.set];const unlocked=setOwned(item.set);return <button key={item.id} className={`v493-store-card rarity-${item.rarity}`} onClick={()=>buySet(item.set)}><div className="v493-store-art"><SafeSetImage setId={item.set} alt={item.label}/></div><div><small>{set.label}</small><strong>{item.label}</strong><span>{unlocked?"SAHİP":set.setPrice===0?"BAŞLANGIÇ":`${set.setPrice} COIN · TAM SET`}</span></div></button>;})}</div>
      <aside className="v493-set-column">{SET_ORDER.map((setId)=>{const set=SETS[setId];const complete=setOwned(setId);return <button key={setId} className={complete?"is-owned":""} onClick={()=>buySet(setId)}><SafeSetImage setId={setId} alt={set.label}/><div><small>{set.label}</small><strong>{set.shortLabel}</strong><span>{complete?"✓ Açık":set.setPrice===0?"Başlangıç":`${set.setPrice} coin`}</span></div></button>;})}</aside>
    </div>
  </section>;
}
