import { useMemo, useState } from "react";
import { ITEMS } from "../../data/avatarParts";
import { getCatalogMeta } from "../../data/catalog";
import { CHARACTER_PRESETS } from "../../data/gameAssets";
import { playPop } from "../../lib/sound";

const SLOT_TABS = [
  ["outfit", "Kıyafet", "👕"], ["shoes", "Ayakkabı", "👢"], ["headwear", "Başlık", "🧢"],
  ["face", "Aksesuar", "◉"], ["back", "Sırt", "🎒"],
];
const MOTIONS = [["idle", "Rahat", "🏃"], ["thinking", "Düşün", "🤔"], ["happy", "Mutlu", "🙂"], ["victory", "Zafer", "🏆"]];
const OUTFIT_PRESET = { "outfit-labcoat": "explorer", "outfit-infinity-cape": "galaxy", "outfit-cloud-dress": "cloud", "outfit-robe-emerald": "forest" };
const PRESET_LABELS = [["outfit-labcoat", "Kaşif", "explorer"], ["outfit-infinity-cape", "Galaksi", "galaxy"], ["outfit-cloud-dress", "Bulut", "cloud"], ["outfit-robe-emerald", "Orman", "forest"]];

export default function HeroHub({ profile, onChangeAvatar, onOpenLessons, onBuyItem }) {
  const [slot, setSlot] = useState("outfit");
  const [motion, setMotion] = useState("idle");
  const [selectedId, setSelectedId] = useState(profile.avatar?.outfit || "outfit-labcoat");
  const owned = useMemo(() => new Set(profile.unlockedItems || []), [profile.unlockedItems]);
  const items = useMemo(() => ITEMS.filter((item) => item.slot === slot).map(getCatalogMeta), [slot]);
  const selected = items.find((i) => i.id === selectedId) || items[0];
  const equippedIds = [profile.avatar?.headwear, profile.avatar?.outfit, profile.avatar?.face, profile.avatar?.back, profile.avatar?.shoes].filter(Boolean);
  const equipped = equippedIds.map((id) => ITEMS.find((item) => item.id === id)).filter(Boolean).map(getCatalogMeta);
  const outfitPreset = OUTFIT_PRESET[profile.avatar?.outfit] || "explorer";
  const heroSrc = CHARACTER_PRESETS[outfitPreset] || CHARACTER_PRESETS.explorer;

  function choose(item) {
    setSelectedId(item.id);
    playPop();
    if (!owned.has(item.id)) { onBuyItem?.(item); return; }
    onChangeAvatar?.({ ...profile.avatar, [item.slot]: item.id });
  }

  function choosePreset(outfitId) {
    const item = ITEMS.find((entry) => entry.id === outfitId);
    if (!item) return;
    setSlot("outfit"); setSelectedId(outfitId); playPop();
    if (owned.has(outfitId)) onChangeAvatar?.({ ...profile.avatar, outfit: outfitId });
    else onBuyItem?.(item);
  }

  function randomize() {
    const unlockedOutfits = ITEMS.filter((item) => item.slot === "outfit" && owned.has(item.id));
    const next = unlockedOutfits[Math.floor(Math.random() * unlockedOutfits.length)];
    if (next) choosePreset(next.id);
  }

  return (
    <section className="v47-hero-page">
      <aside className="v47-equipped-panel v47-panel"><h3>Kuşanılanlar</h3><div className="v47-equipped-list">
        {equipped.map((item) => <button key={item.id} onClick={() => { setSlot(item.slot); setSelectedId(item.id); }}><img src={item.cardAsset} alt="" /><span><small>{item.slotMeta.label}</small><strong>{item.label}</strong></span></button>)}
      </div></aside>

      <div className="v47-stage-panel"><div className="v47-scene-glow" /><div className={`v47-full-hero motion-${motion}`}><img src={heroSrc} alt="Bilgin Kaşif" /></div><div className="v47-motion-stack">
        {MOTIONS.map(([id, label, icon]) => <button key={id} className={motion === id ? "is-active" : ""} onClick={() => { setMotion(id); playPop(); }}><span>{icon}</span><b>{label}</b></button>)}
        <button onClick={randomize}><span>🎲</span><b>Rastgele</b></button>
      </div></div>

      <div className="v47-wardrobe-panel v47-panel"><div className="v47-slot-tabs">
        {SLOT_TABS.map(([id, label, icon]) => <button key={id} className={slot === id ? "is-active" : ""} onClick={() => { setSlot(id); setSelectedId(profile.avatar?.[id] || null); playPop(); }}><span>{icon}</span>{label}</button>)}
      </div>
      <div className="v47-shop-head"><h2>{SLOT_TABS.find(([id]) => id === slot)?.[1]}ler</h2><b>{items.filter((item) => owned.has(item.id)).length} / {items.length}</b></div>
      <div className="v47-shop-grid">{items.map((item) => { const isOn = profile.avatar?.[slot] === item.id; const unlocked = owned.has(item.id); return <button key={item.id} className={`v47-shop-card rarity-${item.rarity} ${isOn ? "is-equipped" : ""}`} onClick={() => choose(item)}>{isOn && <i>✓</i>}<img src={item.cardAsset} alt="" /><strong>{item.label}</strong><small style={{ color: item.rarityMeta.color }}>{unlocked ? item.rarityMeta.label : `${item.price || 0} COIN`}</small></button>; })}</div>
      {selected && <div className="v47-detail-card"><div><span>{selected.rarityMeta.label}</span><h3>{selected.label}</h3><p>Her maceraya hazır, Bilgin Kaşif koleksiyonunun özel parçası.</p><ul><li>✦ Bilgi bonusu</li><li>◉ Keşif stili</li><li>⬡ Koleksiyon parçası</li></ul></div><img src={selected.cardAsset} alt="" /><button className={profile.avatar?.[selected.slot] === selected.id ? "is-on" : ""} onClick={() => choose(selected)}>{profile.avatar?.[selected.slot] === selected.id ? "✓ TAKILI" : owned.has(selected.id) ? "KUŞAN" : `${selected.price || 0} COIN`}</button></div>}
      <div className="v47-combos"><h3>Kombinasyon Önerileri</h3><div>{PRESET_LABELS.map(([id, label, preset]) => <button key={id} className={profile.avatar?.outfit === id ? "is-active" : ""} onClick={() => choosePreset(id)}><img src={CHARACTER_PRESETS[preset]} alt="" /><span>{label}</span>{profile.avatar?.outfit === id ? <i>✓</i> : <i>★</i>}</button>)}</div></div></div>

      <div className="v47-learning-strip"><div className="v47-lesson-cta"><span>📖</span><div><strong>Dersler & Öğrenme</strong><small>Yeni bilgiler keşfet, sınavları geç, ödüller kazan.</small></div><button onClick={onOpenLessons}>Derslere Git →</button></div><div className="v47-daily-mini"><b>Önerilen Ders</b><span>Fen Bilimleri · Keşif Görevi</span><i><em style={{ width: "60%" }} /></i></div><div className="v47-daily-mini"><b>Günlük Hedef</b><span>1 ders tamamla · 1 soru çöz</span><i><em style={{ width: "34%" }} /></i></div></div>
    </section>
  );
}
