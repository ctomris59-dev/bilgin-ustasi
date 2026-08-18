import { useMemo, useState } from "react";
import { ITEMS, SETS, SET_LOADOUTS } from "../../data/avatarParts";
import { getCatalogMeta } from "../../data/catalog";
import { playPop } from "../../lib/sound";
import WardrobeAvatar from "../v48/WardrobeAvatar";

const SLOT_TABS = [["outfit","Kıyafet","👕"],["shoes","Ayakkabı","👢"],["headwear","Başlık","🧢"],["face","Aksesuar","◉"],["back","Sırt","🎒"]];
const MOTIONS = [["idle","Rahat","🏃"],["thinking","Düşün","🤔"],["happy","Mutlu","🙂"],["victory","Zafer","🏆"]];
const SET_ORDER = ["explorer","galaxy","cloud","forest"];

export default function HeroHub({ profile, onChangeAvatar, onOpenLessons, onBuyItem }) {
  const [slot,setSlot] = useState("outfit");
  const [motion,setMotion] = useState("idle");
  const [selectedId,setSelectedId] = useState(profile.avatar?.outfit || SET_LOADOUTS.explorer.outfit);
  const owned = useMemo(()=>new Set(profile.unlockedItems || []),[profile.unlockedItems]);
  const items = useMemo(()=>ITEMS.filter((item)=>item.slot===slot).map(getCatalogMeta),[slot]);
  const selected = items.find((i)=>i.id===selectedId) || items[0];
  const equippedIds = [profile.avatar?.headwear,profile.avatar?.outfit,profile.avatar?.face,profile.avatar?.back,profile.avatar?.shoes].filter(Boolean);
  const equipped = equippedIds.map((id)=>ITEMS.find((item)=>item.id===id)).filter(Boolean).map(getCatalogMeta);

  function choose(item){
    setSelectedId(item.id); playPop();
    if(!owned.has(item.id)){ onBuyItem?.(item); return; }
    onChangeAvatar?.({...profile.avatar,[item.slot]:item.id});
  }

  function applySet(setId){
    const loadout = SET_LOADOUTS[setId]; if(!loadout) return;
    const ids = Object.values(loadout);
    const missing = ids.map((id)=>ITEMS.find((x)=>x.id===id)).find((item)=>item && !owned.has(item.id));
    if(missing){ setSlot(missing.slot); setSelectedId(missing.id); onBuyItem?.(missing); return; }
    playPop(); onChangeAvatar?.({...profile.avatar,...loadout});
  }

  function randomize(){
    const available = SET_ORDER.filter((id)=>Object.values(SET_LOADOUTS[id]).every((itemId)=>owned.has(itemId)));
    const setId = available[Math.floor(Math.random()*available.length)] || "explorer";
    applySet(setId);
  }

  return <section className="v47-hero-page">
    <aside className="v47-equipped-panel v47-panel"><h3>Kuşanılanlar</h3><div className="v47-equipped-list">{equipped.map((item)=><button key={item.id} onClick={()=>{setSlot(item.slot);setSelectedId(item.id);}}><img src={item.cardAsset} alt=""/><span><small>{item.slotMeta.label}</small><strong>{item.label}</strong></span></button>)}</div></aside>

    <div className="v47-stage-panel"><div className="v47-scene-glow"/><div className={`v47-full-hero motion-${motion}`}><WardrobeAvatar avatar={profile.avatar}/></div><div className="v47-motion-stack">{MOTIONS.map(([id,label,icon])=><button key={id} className={motion===id?"is-active":""} onClick={()=>{setMotion(id);playPop();}}><span>{icon}</span><b>{label}</b></button>)}<button onClick={randomize}><span>🎲</span><b>Rastgele</b></button></div></div>

    <div className="v47-wardrobe-panel v47-panel"><div className="v47-slot-tabs">{SLOT_TABS.map(([id,label,icon])=><button key={id} className={slot===id?"is-active":""} onClick={()=>{setSlot(id);setSelectedId(profile.avatar?.[id]||ITEMS.find((x)=>x.slot===id)?.id);playPop();}}><span>{icon}</span>{label}</button>)}</div>
      <div className="v47-shop-head"><h2>{SLOT_TABS.find(([id])=>id===slot)?.[1]}ler</h2><b>{items.filter((item)=>owned.has(item.id)).length} / {items.length}</b></div>
      <div className="v47-shop-grid">{items.map((item)=>{const isOn=profile.avatar?.[slot]===item.id;const unlocked=owned.has(item.id);return <button key={item.id} className={`v47-shop-card rarity-${item.rarity} ${isOn?"is-equipped":""}`} onClick={()=>choose(item)}>{isOn&&<i>✓</i>}<img src={item.cardAsset} alt=""/><strong>{item.label}</strong><small style={{color:item.rarityMeta.color}}>{unlocked?SETS[item.set]?.label:`${item.price||0} COIN`}</small></button>;})}</div>
      {selected&&<div className="v47-detail-card"><div><span>{SETS[selected.set]?.label || selected.rarityMeta.label}</span><h3>{selected.label}</h3><p>Bu parça yalnızca Bilgin Kaşif’in sabit master silüeti için tasarlandı; animasyonlarda aynı karakter üzerinde kalır.</p><ul><li>✦ {SETS[selected.set]?.bonus}</li><li>◉ Master-fit giydirme</li><li>⬡ V4.8 yeni koleksiyon</li></ul></div><img src={selected.cardAsset} alt=""/><button className={profile.avatar?.[selected.slot]===selected.id?"is-on":""} onClick={()=>choose(selected)}>{profile.avatar?.[selected.slot]===selected.id?"✓ TAKILI":owned.has(selected.id)?"KUŞAN":`${selected.price||0} COIN`}</button></div>}
      <div className="v47-combos"><h3>Setler</h3><div>{SET_ORDER.map((setId)=>{const loadout=SET_LOADOUTS[setId];const active=Object.entries(loadout).every(([s,id])=>profile.avatar?.[s]===id);const complete=Object.values(loadout).every((id)=>owned.has(id));return <button key={setId} className={active?"is-active":""} onClick={()=>applySet(setId)}><WardrobeAvatar avatar={{...profile.avatar,...loadout}} compact/><span>{SETS[setId].label}</span>{active?<i>✓</i>:<i>{complete?"★":"🔒"}</i>}</button>;})}</div></div>
    </div>

    <div className="v47-learning-strip"><div className="v47-lesson-cta"><span>📖</span><div><strong>Dersler & Öğrenme</strong><small>Yeni bilgiler keşfet, sınavları geç, ödüller kazan.</small></div><button onClick={onOpenLessons}>Derslere Git →</button></div><div className="v47-daily-mini"><b>Önerilen Ders</b><span>Fen Bilimleri · Keşif Görevi</span><i><em style={{width:"60%"}}/></i></div><div className="v47-daily-mini"><b>Günlük Hedef</b><span>1 ders tamamla · 1 soru çöz</span><i><em style={{width:"34%"}}/></i></div></div>
  </section>;
}
