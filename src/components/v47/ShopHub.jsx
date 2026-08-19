import { useState } from "react";
import { CHARACTER_STYLES, STYLE_BY_ID, isStyleUnlocked } from "../../data/characterStyles";
import { playPop } from "../../lib/sound";

const PAGE_SIZE=10;
function StyleImage({style}){const[failed,setFailed]=useState(false);return failed?<div className="v50-image-fallback"><span>★</span><b>{style.shortLabel}</b></div>:<img src={style.image} alt={style.label} onError={()=>setFailed(true)}/>;}

export default function ShopHub({profile,onOpenHero,onOpenLessons}){
  const activeId=STYLE_BY_ID[profile.avatar?.styleId]?profile.avatar.styleId:"style-01";
  const [selectedId,setSelectedId]=useState(activeId);
  const [page,setPage]=useState(Math.floor(((STYLE_BY_ID[activeId]?.index||1)-1)/PAGE_SIZE));
  const selected=STYLE_BY_ID[selectedId]||CHARACTER_STYLES[0];
  const pageStyles=CHARACTER_STYLES.slice(page*PAGE_SIZE,page*PAGE_SIZE+PAGE_SIZE);
  const unlockedCount=CHARACTER_STYLES.filter((style)=>isStyleUnlocked(style.id,profile.xp||0)).length;
  function select(style){setSelectedId(style.id);playPop();}
  function action(){playPop();if(isStyleUnlocked(selected.id,profile.xp||0)){onOpenHero?.();}else{onOpenLessons?.();}}
  return <section className="v50-shop-page">
    <header className="v50-shop-header v47-panel"><div><span className="v47-eyebrow">STİL GALERİSİ</span><h1>20 Bilgin Kaşif görünümünü keşfet.</h1><p>Coin harcamazsın. Ders ve testlerden XP kazandıkça yeni stiller otomatik açılır.</p></div><div className="v50-shop-progress"><small>KOLEKSİYON</small><strong>{unlockedCount}<i>/20</i></strong><span>{profile.xp||0} XP</span></div></header>
    <div className="v50-shop-shell v47-panel">
      <div className="v50-shop-grid">{pageStyles.map((style)=>{const owned=isStyleUnlocked(style.id,profile.xp||0);const active=style.id===activeId;const selectedNow=style.id===selectedId;return <button key={style.id} className={`v50-store-card ${selectedNow?"is-selected":""} ${active?"is-active":""} ${!owned?"is-locked":""}`} onClick={()=>select(style)}><div><StyleImage style={style}/>{!owned&&<i>🔒</i>}{active&&<em>✓</em>}</div><span>STİL {String(style.index).padStart(2,"0")}</span><strong>{style.shortLabel}</strong><small>{owned?active?"TAKILI":"AÇIK":`${style.unlockXp} XP`}</small></button>;})}</div>
      <aside className="v50-shop-detail"><div className="v50-shop-detail-art"><StyleImage style={selected}/></div><div className="v50-shop-detail-copy"><span>STİL {String(selected.index).padStart(2,"0")}</span><h2>{selected.label}</h2><p>{selected.description}</p><ul><li>✦ Aynı Bilgin Kaşif karakteri</li><li>▣ Sabit 1024×1536 master çözünürlük</li><li>🏆 XP kazanarak kalıcı açılır</li></ul></div><button onClick={action}>{isStyleUnlocked(selected.id,profile.xp||0)?selected.id===activeId?"✓ ŞU AN TAKILI":"KAHRAMANDA DENE / KUŞAN →":`DERSLERLE ${Math.max(0,selected.unlockXp-(profile.xp||0))} XP KAZAN →`}</button></aside>
      <div className="v50-shop-pager"><button disabled={page===0} onClick={()=>{setPage(0);playPop();}}>01–10</button><button disabled={page===1} onClick={()=>{setPage(1);playPop();}}>11–20</button></div>
    </div>
  </section>;
}
