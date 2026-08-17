import AvatarCanvas from "../avatar/AvatarCanvas";
import PetCanvas from "../avatar/PetCanvas";
import RoomBackground from "../avatar/RoomBackground";
import { getLevelInfo } from "../../data/levels";
import { getWorldProgress } from "../../data/worlds";
import { CATALOG_ITEMS, getCatalogMeta, isItemEquipped } from "../../data/catalog";
import { GAME_ASSETS } from "../../data/gameAssets";

export default function RightRail({ profile, tests = [], activeSection, selectedItem, onOpenWorldMap, onOpenMistakes, onStartTest, onBuyItem, onEquipItem, onOpenShop, onOpenCharacter }) {
  if (activeSection === "shop") return <ShopInspector profile={profile} item={selectedItem} onBuyItem={onBuyItem} onEquipItem={onEquipItem} onOpenCharacter={onOpenCharacter} />;
  if (activeSection === "wardrobe") return <CharacterInspector profile={profile} item={selectedItem} onEquipItem={onEquipItem} onOpenShop={onOpenShop} />;
  return <DefaultRail profile={profile} tests={tests} activeSection={activeSection} onOpenWorldMap={onOpenWorldMap} onOpenMistakes={onOpenMistakes} onStartTest={onStartTest} onOpenShop={onOpenShop} onOpenCharacter={onOpenCharacter} />;
}

function DefaultRail({ profile, tests, activeSection, onOpenWorldMap, onOpenMistakes, onStartTest, onOpenShop, onOpenCharacter }) {
  const { current } = getLevelInfo(profile.xp || 0); const { currentWorld, nextWorld } = getWorldProgress(current.level);
  const unresolved=(profile.mistakeBox||[]).filter((m)=>!m.resolved).length; const today=new Date().toISOString().slice(0,10); const history=(profile.history||[]).filter((h)=>String(h.date||"").slice(0,10)===today); const todayCorrect=history.reduce((s,h)=>s+(h.correctCount||0),0); const mainTest=tests[0];
  return <aside className="v4-right-rail v4x-right-rail">
    <section className="v4x-rail-character">
      <header><div><small>KAŞİF PROFİLİ</small><strong>{profile.childName}</strong></div><span>Lv. {current.level}</span></header>
      <div className="v4x-premium-hero-stage"><img src={GAME_ASSETS.heroStage} alt="Kaşif ve keşif dostu"/><span>AKTİF PROFİL</span></div>
      <div className="v4x-rail-actions"><button onClick={onOpenCharacter}>Karakteri Düzenle</button><button onClick={onOpenShop}>Dükkana Git</button></div>
      <div className="v4x-rail-statrow"><Stat value={profile.streak?.current||0} label="Seri" color="#FF789E"/><Stat value={todayCorrect} label="Bugün doğru" color="#52E3C2"/><Stat value={unresolved} label="Tekrar" color="#FFD166"/></div>
    </section>
    <section className="v4x-rail-card"><header><div><small>AKTİF DÜNYA</small><strong>{currentWorld.title}</strong></div><b style={{color:currentWorld.accent}}>{currentWorld.emoji}</b></header><p>{currentWorld.blurb}</p><button className="v4x-rail-primary" onClick={onOpenWorldMap}>Haritayı Aç →</button>{nextWorld&&<div className="v4x-next-world"><span>Sıradaki</span><strong>{nextWorld.title}</strong><small>Seviye {nextWorld.unlockLevel}</small></div>}</section>
    <section className="v4x-rail-card"><header><div><small>ÖĞRENME DÖNGÜSÜ</small><strong>Bugünkü İlerleme</strong></div><i/></header><div className="v4x-loop"><Loop no="01" label="Test çöz" done={history.length>0}/><Loop no="02" label="XP + coin kazan" done={history.length>0}/><Loop no="03" label="Item aç & kullan" done={(profile.unlockedItems||[]).length>2}/></div>{activeSection!=="mistakes"&&unresolved>0&&<button className="v4x-rail-secondary" onClick={onOpenMistakes}>Tekrar Merkezi · {unresolved}</button>}{activeSection==="dashboard"&&mainTest&&<button className="v4x-rail-primary cyan" onClick={()=>onStartTest(mainTest)}>Bugünün Testine Başla →</button>}</section>
  </aside>;
}

function ShopInspector({ profile, item, onBuyItem, onEquipItem, onOpenCharacter }) {
  const meta=item?getCatalogMeta(item):null; const owned=meta&&(profile.unlockedItems||[]).includes(meta.id); const equipped=meta&&isItemEquipped(profile,meta); const level=getLevelInfo(profile.xp||0).current.level;
  const related = meta?.set ? CATALOG_ITEMS.filter((row)=>row.set===meta.set && row.id!==meta.id).slice(0,4).map(getCatalogMeta) : [];
  const bonus = meta ? itemBonus(meta.rarity) : null;
  return <aside className="v4-right-rail v4x-right-rail">
    <section className="v4x-rail-card v4x-inspector-card v43-inspector-card">
      <header><div><small>ÜRÜN DETAYI</small><strong>{meta?.slotMeta.label||"Bir item seç"}</strong></div>{meta&&<span className={`v4x-rarity-badge rarity-${meta.rarity}`}>{meta.rarityMeta.label}</span>}</header>
      {meta? <>
        <div className={`v4x-inspector-art rarity-${meta.rarity}`} style={{"--item-accent":meta.rarityMeta.color}}><img src={meta.cardAsset} alt={meta.label}/></div>
        <h3>{meta.label}</h3><p>{meta.world.title} koleksiyonuna ait {meta.slotMeta.label.toLocaleLowerCase("tr-TR")}. Testlerden kazandığın coin ve kristallerle keşif stilini geliştir.</p>
        <div className="v43-item-bonuses"><span><b>✦</b> +{bonus.xp}% XP</span><span><b>◈</b> +{bonus.coin}% Coin</span>{bonus.spark&&<span><b>◆</b> Özel Parıltı</span>}</div>
        <div className="v4x-inspector-stats"><Stat value={`Sv. ${meta.world.unlockLevel}`} label="Bölge seviyesi" color={meta.world.accent}/><Stat value={meta.price||"Özel"} label="Coin fiyatı" color="#FFD166"/></div>
        {owned?<button className={`v4x-rail-primary ${equipped?"owned":"cyan"}`} onClick={()=>onEquipItem?.(meta)}>{equipped?"✓ Takılı · Çıkar/Koru":"Kuşan / Kullan"}</button>:meta.legendary?<div className="v4x-legendary-note">✦ Bu item satın alınmaz; ilgili testte kusursuz görev ile açılır.</div>:level<meta.world.unlockLevel?<div className="v4x-locked-note">Seviye {meta.world.unlockLevel}'e ulaşınca satın alınabilir.</div>:<button className="v4x-rail-primary gold" disabled={(profile.coins||0)<meta.price} onClick={()=>onBuyItem?.(meta)}>◈ {meta.price} · {(profile.coins||0)>=meta.price?"Satın Al":`${meta.price-(profile.coins||0)} coin daha`}</button>}
        {related.length>0&&<div className="v43-set-box"><small>SET PARÇALARI</small><strong>{meta.set} koleksiyonu</strong><div>{related.map((row)=><span key={row.id} title={row.label}><img src={row.cardAsset} alt=""/></span>)}</div></div>}
        <div className="v43-how-to"><small>NASIL KAZANILIR?</small><div><span>▣</span><b>Kaşif Dükkânı</b><em>{meta.legendary?"Özel görev":"Coin ile satın al"}</em></div><div><span>★</span><b>Kusursuz Test</b><em>10/10 doğru ile kristal kazan</em></div><div><span>✓</span><b>Haftalık Görev</b><em>Düzenli çalış, dünyaları aç</em></div></div>
        <button className="v4x-rail-secondary" onClick={onOpenCharacter}>Karakter Envanterini Aç</button>
      </>:<div className="v4x-inspector-empty">Dükkandan bir karta dokun; item burada büyük önizleme ile açılır.</div>}
    </section>
    <MiniCharacter profile={profile}/>
  </aside>;
}

function itemBonus(rarity){ return { common:{xp:2,coin:1,spark:false}, rare:{xp:5,coin:3,spark:false}, epic:{xp:8,coin:5,spark:true}, legendary:{xp:10,coin:7,spark:true} }[rarity] || {xp:2,coin:1,spark:false}; }

function CharacterInspector({ profile, item, onEquipItem, onOpenShop }) {
  const meta=item?getCatalogMeta(item):null; const equipped=meta&&isItemEquipped(profile,meta);
  return <aside className="v4-right-rail v4x-right-rail"><MiniCharacter profile={profile} large/><section className="v4x-rail-card v4x-equipped-panel"><header><div><small>SEÇİLİ ITEM</small><strong>{meta?.label||"Envanterden seç"}</strong></div></header>{meta?<><div className="v4x-selected-item-row"><img src={meta.cardAsset} alt=""/><div><span style={{color:meta.rarityMeta.color}}>{meta.rarityMeta.label}</span><strong>{meta.slotMeta.label}</strong><small>{meta.world.shortTitle}</small></div></div>{(profile.unlockedItems||[]).includes(meta.id)&&["outfit","shoes","headwear","face","back","petSpecies","petAccessory"].includes(meta.slot)&&<button className={`v4x-rail-primary ${equipped?"owned":"cyan"}`} onClick={()=>onEquipItem?.(meta)}>{equipped?"✓ Takılı":"Kuşan / Aktif Et"}</button>}</>:<p>Orta panelden bir item seçerek ayrıntısını burada görebilirsin.</p>}<button className="v4x-rail-secondary" onClick={onOpenShop}>Yeni Item Aç → Dükkan</button></section></aside>;
}

function MiniCharacter({ profile, large=false }) { const level=getLevelInfo(profile.xp||0).current.level; return <section className={`v4x-rail-character ${large?"is-large":""}`}><header><div><small>KARAKTER & EKİPMAN</small><strong>{profile.childName}</strong></div><span>Lv. {level}</span></header><div className="v4x-rail-stage"><RoomBackground room={profile.rooms?.bedroom} compact><AvatarCanvas avatar={profile.avatar} size={large?205:160}/>{profile.pet?.activeSpecies&&<div className="v4x-rail-pet"><PetCanvas pet={profile.pet} size={large?78:60}/></div>}</RoomBackground></div><div className="v4x-equipment-slots">{[["outfit","Kıyafet"],["shoes","Ayakkabı"],["headwear","Başlık"],["face","Aksesuar"],["back","Sırt"]].map(([key,label])=><div key={key}><span>{profile.avatar?.[key]?"✓":"–"}</span><small>{label}</small></div>)}</div></section>; }
function Stat({value,label,color}){return <div><strong style={{color}}>{value}</strong><small>{label}</small></div>}
function Loop({no,label,done}){return <div className={done?"is-done":""}><span>{done?"✓":no}</span><strong>{label}</strong></div>}
