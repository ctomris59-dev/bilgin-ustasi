import { useMemo, useState } from "react";
import { ITEMS, SETS, SET_LOADOUTS } from "../../data/avatarParts";
import { getCatalogMeta } from "../../data/catalog";
import { getCharacterSetAsset } from "../../data/gameAssets";
import { playPop } from "../../lib/sound";

const SLOT_TABS = [
  ["outfit", "Kıyafet", "👕"],
  ["shoes", "Ayakkabı", "👢"],
  ["headwear", "Başlık", "🧢"],
  ["face", "Aksesuar", "◉"],
  ["back", "Sırt", "🎒"],
];
const SET_ORDER = ["explorer", "cloud", "forest"];

export default function ShopHub({ profile, onBuyItem, onOpenHero }) {
  const [slot, setSlot] = useState("outfit");
  const [selectedSet, setSelectedSet] = useState("explorer");
  const owned = useMemo(() => new Set(profile?.unlockedItems || []), [profile?.unlockedItems]);
  const items = useMemo(() => ITEMS.filter((item) => item.slot === slot).map(getCatalogMeta), [slot]);
  const selected = items.find((item) => item.set === selectedSet) || items[0];
  const setOwned = (setId) => Object.values(SET_LOADOUTS[setId] || {}).every((id) => owned.has(id));

  function selectItem(item) {
    playPop();
    setSelectedSet(item.set);
  }

  function action(item) {
    if (!item) return;
    playPop();
    onBuyItem?.(item);
    if (setOwned(item.set)) onOpenHero?.();
  }

  return (
    <section className="v493-shop-page">
      <header className="v493-shop-header v47-panel">
        <div>
          <span className="v47-eyebrow">DÜKKAN</span>
          <h1>Kaşif ekipmanlarını keşfet.</h1>
          <p>Dükkan satın alma içindir. Kahraman sayfası yalnızca sahip olduğun setleri kuşanır.</p>
        </div>
        <div className="v493-shop-wallet"><small>CÜZDAN</small><strong>◈ {profile?.coins || 0}</strong><span>COIN</span></div>
      </header>

      <div className="v493-shop-shell v47-panel">
        <div className="v493-shop-tabs">
          {SLOT_TABS.map(([id, label, icon]) => (
            <button key={id} className={slot === id ? "is-active" : ""} onClick={() => { setSlot(id); playPop(); }}>
              <span>{icon}</span><b>{label}</b>
            </button>
          ))}
        </div>

        <div className="v493-shop-content">
          <div className="v493-shop-items">
            {items.map((item) => {
              const set = SETS[item.set];
              const isOwned = setOwned(item.set);
              const active = selected?.id === item.id;
              return (
                <button key={item.id} className={`v493-store-card rarity-${item.rarity} ${active ? "is-selected" : ""}`} onClick={() => selectItem(item)}>
                  <div className="v493-store-art"><img src={getCharacterSetAsset(item.set)} alt={item.label} /></div>
                  <div className="v493-store-copy"><small>{set?.label}</small><strong>{item.label}</strong><span>{isOwned ? "✓ SAHİP" : `◈ ${set?.setPrice || 0} · 5 PARÇA SET`}</span></div>
                </button>
              );
            })}
          </div>

          {selected && <aside className="v493-shop-detail">
            <div className="v493-shop-detail-art"><img src={getCharacterSetAsset(selected.set)} alt={`${SETS[selected.set]?.label} Bilgin Kaşif`} /></div>
            <div className="v493-shop-detail-copy">
              <span>{SETS[selected.set]?.label}</span>
              <h2>{selected.label}</h2>
              <p>{SETS[selected.set]?.description}</p>
              <ul><li>✦ {SETS[selected.set]?.bonus}</li><li>⬡ 5 parça birlikte açılır</li><li>✓ Bilgin Kaşif'e özel tam render</li></ul>
            </div>
            <button className={setOwned(selected.set) ? "is-owned" : ""} onClick={() => action(selected)}>
              {setOwned(selected.set) ? "Kahramanda Kuşan →" : `◈ ${SETS[selected.set]?.setPrice || 0} · SETİ SATIN AL`}
            </button>
          </aside>}
        </div>

        <div className="v493-shop-sets">
          <strong>Tam Setler</strong>
          <div>{SET_ORDER.map((setId) => (
            <button key={setId} className={selectedSet === setId ? "is-active" : ""} onClick={() => { setSelectedSet(setId); playPop(); }}>
              <img src={getCharacterSetAsset(setId)} alt={`${SETS[setId]?.label} önizleme`} />
              <span>{SETS[setId]?.shortLabel}</span>
              <i>{setOwned(setId) ? "✓" : "🔒"}</i>
            </button>
          ))}</div>
        </div>
      </div>
    </section>
  );
}
