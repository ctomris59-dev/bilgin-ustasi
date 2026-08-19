import { useMemo, useState } from "react";
import { CHARACTER_STYLES, STYLE_BY_ID, DEFAULT_STYLE_ID, getUnlockedStyles, isStyleUnlocked } from "../../data/characterStyles";
import { playPop } from "../../lib/sound";

const MOTIONS=[["idle","Rahat","🏃"],["thinking","Düşün","🤔"],["happy","Mutlu","🙂"],["victory","Zafer","🏆"]];
const PAGE_SIZE=6;

function StyleImage({style,className="",alt=""}){
  const [failed,setFailed]=useState(false);
  if(!style)return null;
  return failed?<div className={`v50-image-fallback ${className}`}><span>★</span><b>{style.shortLabel}</b></div>:<img className={className} src={style.image} alt={alt||style.label} onError={()=>setFailed(true)}/>;
}

export default function HeroHub({profile,onChangeAvatar,onOpenLessons,onOpenShop}){
  const activeId=STYLE_BY_ID[profile.avatar?.styleId]?profile.avatar.styleId:DEFAULT_STYLE_ID;
  const [previewId,setPreviewId]=useState(activeId);
  const [motion,setMotion]=useState("idle");
  const [page,setPage]=useState(Math.floor((STYLE_BY_ID[activeId]?.index-1||0)/PAGE_SIZE));
  const active=STYLE_BY_ID[activeId];
  const preview=STYLE_BY_ID[previewId]||active;
  const unlocked=useMemo(()=>getUnlockedStyles(profile.xp||0),[profile.xp]);
  const totalPages=Math.ceil(CHARACTER_STYLES.length/PAGE_SIZE);
  const pageStyles=CHARACTER_STYLES.slice(page*PAGE_SIZE,page*PAGE_SIZE+PAGE_SIZE);
  const nextLocked=CHARACTER_STYLES.find((style)=>!isStyleUnlocked(style.id,profile.xp||0));
  const isPreviewing=preview.id!==active.id;
  const canEquip=isStyleUnlocked(preview.id,profile.xp||0);

  function previewStyle(style){setPreviewId(style.id);setPage(Math.floor((style.index-1)/PAGE_SIZE));playPop();}
  function equipPreview(){if(!canEquip)return;playPop();onChangeAvatar?.({styleId:preview.id,characterStyle:"bilgin-kasif-master"});}
  function randomize(){const pool=unlocked.length?unlocked:[CHARACTER_STYLES[0]];previewStyle(pool[Math.floor(Math.random()*pool.length)]);}
  function shiftPage(delta){const next=(page+delta+totalPages)%totalPages;setPage(next);playPop();}

  return <section className="v50-hero-page">
    <aside className="v50-status-panel v47-panel">
      <span className="v47-eyebrow">AKTİF GÖRÜNÜM</span>
      <div className="v50-active-thumb"><StyleImage style={active}/></div>
      <h2>{active.label}</h2><p>{active.description}</p>
      <div className="v50-unlock-stat"><strong>{unlocked.length}<small>/20</small></strong><span>Açılan Stil</span></div>
      {nextLocked?<div className="v50-next-style"><small>SONRAKİ STİL</small><b>{nextLocked.shortLabel}</b><div><i style={{width:`${Math.min(100,Math.round(((profile.xp||0)/nextLocked.unlockXp)*100))}%`}}/></div><span>{profile.xp||0} / {nextLocked.unlockXp} XP</span></div>:<div className="v50-next-style is-complete"><b>🏆 Koleksiyon tamamlandı!</b></div>}
      <button className="v50-shop-link" onClick={onOpenShop}>20 Stilin Tamamını Gör →</button>
    </aside>

    <div className="v47-stage-panel v50-stage-panel"><div className="v47-scene-glow"/>{isPreviewing&&<div className="v494-tryon-badge">DENEME · {preview.shortLabel}</div>}<div className={`v47-full-hero motion-${motion}`}><StyleImage className="v50-style-hero" style={preview} alt={`${preview.label} Bilgin Kaşif`}/></div><div className="v47-motion-stack">{MOTIONS.map(([id,label,icon])=><button key={id} className={motion===id?"is-active":""} onClick={()=>{setMotion(id);playPop();}}><span>{icon}</span><b>{label}</b></button>)}<button onClick={randomize}><span>🎲</span><b>Rastgele</b></button></div></div>

    <div className="v50-style-panel v47-panel">
      <div className="v50-style-head"><div><span className="v47-eyebrow">STİL KOLEKSİYONU</span><h2>Bilgin Kaşif · 20 Görünüm</h2></div><b>{page+1}/{totalPages}</b></div>
      <div className="v50-style-grid">{pageStyles.map((style)=>{const owned=isStyleUnlocked(style.id,profile.xp||0);const isActive=active.id===style.id;const selected=preview.id===style.id;return <button key={style.id} className={`v50-style-card ${selected?"is-selected":""} ${isActive?"is-active":""} ${!owned?"is-locked":""}`} onClick={()=>previewStyle(style)}><div><StyleImage style={style}/>{!owned&&<i>🔒</i>}{isActive&&<em>✓</em>}</div><strong>{style.shortLabel}</strong><small>{owned?isActive?"TAKILI":"AÇIK":`${style.unlockXp} XP`}</small></button>;})}</div>
      <div className="v50-pager"><button onClick={()=>shiftPage(-1)}>← Önceki</button><div>{Array.from({length:totalPages},(_,i)=><button key={i} className={i===page?"is-active":""} onClick={()=>setPage(i)}>{i+1}</button>)}</div><button onClick={()=>shiftPage(1)}>Sonraki →</button></div>
      <div className="v50-style-detail"><div><span>STİL {String(preview.index).padStart(2,"0")}</span><h3>{preview.label}</h3><p>{preview.description}</p>{canEquip?<small>✓ Bu görünüm XP ile açıldı.</small>:<small>🔒 Açmak için {Math.max(0,preview.unlockXp-(profile.xp||0))} XP daha kazan.</small>}</div><button disabled={!canEquip||active.id===preview.id} onClick={equipPreview}>{active.id===preview.id?"✓ TAKILI":canEquip?"BU STİLİ KUŞAN":`${preview.unlockXp} XP GEREKİYOR`}</button></div>
    </div>

    <div className="v47-learning-strip"><div className="v47-lesson-cta"><span>📖</span><div><strong>Dersler & Öğrenme</strong><small>Testleri tamamla, XP kazan ve yeni karakter stillerini aç.</small></div><button onClick={onOpenLessons}>Derslere Git →</button></div><div className="v47-daily-mini"><b>Stil İlerlemesi</b><span>{unlocked.length} / 20 görünüm açık</span><i><em style={{width:`${unlocked.length*5}%`}}/></i></div><div className="v47-daily-mini"><b>Aktif Stil</b><span>{active.label}</span><i><em style={{width:"100%"}}/></i></div></div>
  </section>;
}
