import { useEffect, useMemo, useState } from "react";
import { CATALOG_ITEMS, CATEGORY_FILTERS, filterCatalog, getCatalogMeta, isItemEquipped } from "../data/catalog";
import { getLevelInfo } from "../data/levels";
import { getWorldAsset } from "../data/gameAssets";
import { playPop } from "../lib/sound";

const RARITIES = [
  { id: "all", label: "Tümü" },
  { id: "common", label: "Common" },
  { id: "rare", label: "Rare" },
  { id: "epic", label: "Epic" },
  { id: "legendary", label: "Legendary" },
];

export default function Shop({ profile, onBuyItem, onRedeemReward, selectedItem, onSelectItem }) {
  const [category, setCategory] = useState("all");
  const [rarity, setRarity] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const [showOwned, setShowOwned] = useState(true);
  const [section, setSection] = useState("items");

  const level = getLevelInfo(profile.xp || 0).current.level;
  const owned = useMemo(() => new Set(profile.unlockedItems || []), [profile.unlockedItems]);
  const enriched = useMemo(() => CATALOG_ITEMS.map(getCatalogMeta), []);

  const visible = useMemo(() => {
    let rows = filterCatalog(enriched, category);
    if (section === "collection") rows = rows.filter((item) => owned.has(item.id));
    if (rarity !== "all") rows = rows.filter((item) => item.rarity === rarity);
    if (!showOwned) rows = rows.filter((item) => !owned.has(item.id));
    const q = query.trim().toLocaleLowerCase("tr-TR");
    if (q) rows = rows.filter((item) => `${item.label} ${item.slotMeta.label} ${item.world.title}`.toLocaleLowerCase("tr-TR").includes(q));

    return [...rows].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rarity") return rarityWeight(b.rarity) - rarityWeight(a.rarity) || a.price - b.price;
      const ao = owned.has(a.id), bo = owned.has(b.id);
      if (ao !== bo) return ao ? 1 : -1;
      const al = a.world.unlockLevel > level, bl = b.world.unlockLevel > level;
      if (al !== bl) return al ? 1 : -1;
      return rarityWeight(b.rarity) - rarityWeight(a.rarity) || a.price - b.price;
    });
  }, [category, enriched, level, owned, query, rarity, section, showOwned, sort]);

  useEffect(() => {
    if (section !== "items") return;
    if (!selectedItem && visible[0]) onSelectItem?.(visible[0]);
    if (selectedItem && !visible.some((item) => item.id === selectedItem.id) && visible[0]) onSelectItem?.(visible[0]);
  }, [visible, selectedItem, onSelectItem, section]);

  const purchasable = visible.filter((item) => !owned.has(item.id) && item.world.unlockLevel <= level && profile.coins >= item.price && !item.legendary).length;
  const currentWorld = visible.find((item) => item.world.unlockLevel <= level)?.world;

  return (
    <div className="v4x-shop-screen">
      <section className="v4x-shop-hero">
        <img src={getWorldAsset(currentWorld?.id || "w3")} alt="" />
        <div className="v4x-shop-hero-shade" />
        <div className="v4x-shop-hero-copy">
          <span className="v4x-eyebrow">KAŞİF DÜKKÂNI</span>
          <h2>Bilgini ekipmana dönüştür</h2>
          <p>Testlerden kazandığın coinlerle karakterini, keşif dostunu ve üssünü geliştir.</p>
          <div className="v4x-hero-loop"><b>TEST ÇÖZ</b><i>→</i><b>XP + COIN</b><i>→</i><b>ITEM AÇ</b><i>→</i><b>KULLAN</b></div>
        </div>
        <div className="v4x-shop-wallet">
          <small>CÜZDAN</small>
          <strong><span>◈</span>{profile.coins || 0}</strong>
          <em>{purchasable} ürün şu an alınabilir</em>
        </div>
      </section>

      <div className="v4x-shop-tabs">
        <button className={section === "items" ? "is-active" : ""} onClick={() => setSection("items")}>Dükkan</button>
        <button className={section === "collection" ? "is-active" : ""} onClick={() => setSection("collection")}>Koleksiyon <span>{owned.size}</span></button>
        <button className={section === "rewards" ? "is-active" : ""} onClick={() => setSection("rewards")}>Gerçek Ödüller</button>
      </div>

      {section === "rewards" ? (
        <RealRewards profile={profile} onRedeemReward={onRedeemReward} />
      ) : (
        <>
          <section className="v4x-catalog-toolbar">
            <div className="v4x-category-row">
              {CATEGORY_FILTERS.map((entry) => (
                <button key={entry.id} className={category === entry.id ? "is-active" : ""} onClick={() => { playPop(); setCategory(entry.id); }}>
                  {entry.label}
                </button>
              ))}
            </div>
            <div className="v4x-catalog-controls">
              <label className="v4x-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ürün ara..." /></label>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="recommended">Önerilen</option>
                <option value="rarity">Nadirlik</option>
                <option value="price-low">Fiyat ↑</option>
                <option value="price-high">Fiyat ↓</option>
              </select>
              <button className={`v4x-owned-toggle ${showOwned ? "is-active" : ""}`} onClick={() => setShowOwned((v) => !v)}>Sahip olduklarım</button>
            </div>
            <div className="v4x-rarity-row">
              {RARITIES.map((entry) => <button key={entry.id} className={`rarity-${entry.id} ${rarity === entry.id ? "is-active" : ""}`} onClick={() => setRarity(entry.id)}>{entry.label}</button>)}
              <span className="v4x-results-count">{visible.length} item</span>
            </div>
          </section>

          <section className="v4x-item-grid">
            {visible.map((item) => {
              const isOwned = owned.has(item.id);
              const isEquipped = isItemEquipped(profile, item);
              const locked = item.world.unlockLevel > level || item.legendary;
              return (
                <ItemCard
                  key={item.id}
                  item={item}
                  selected={selectedItem?.id === item.id}
                  owned={isOwned}
                  equipped={isEquipped}
                  locked={locked && !isOwned}
                  affordable={(profile.coins || 0) >= item.price}
                  collectionMode={section === "collection"}
                  onClick={() => { playPop(); onSelectItem?.(item); }}
                  onBuy={() => onBuyItem?.(item)}
                />
              );
            })}
          </section>

          {visible.length === 0 && <div className="v4x-empty"><span>◇</span><strong>Bu filtrede item yok</strong><small>Başka kategori veya nadirlik seç.</small></div>}
        </>
      )}
    </div>
  );
}

function ItemCard({ item, selected, owned, equipped, locked, affordable, onClick, onBuy, collectionMode }) {
  const accent = item.rarityMeta.color;
  return (
    <article className={`v4x-item-card rarity-${item.rarity} ${selected ? "is-selected" : ""} ${locked ? "is-locked" : ""}`} style={{ "--item-accent": accent }}>
      <button className="v4x-card-main" onClick={onClick} type="button">
        <div className="v4x-item-rarity"><span>{item.rarityMeta.label}</span>{equipped && <b>TAKILI</b>}</div>
        <div className="v4x-item-art"><img src={item.cardAsset} alt={item.label} /></div>
        <div className="v4x-item-copy"><small>{item.slotMeta.label}</small><strong>{item.label}</strong><em>{item.world.shortTitle}</em></div>
      </button>
      <div className="v4x-item-action">
        {locked ? (
          <span className="v4x-lock-copy">{item.legendary ? "Görev başarısıyla açılır" : `Seviye ${item.world.unlockLevel}'de açılır`}</span>
        ) : owned ? (
          <button type="button" onClick={onClick} className={equipped ? "is-equipped" : "is-owned"}>{equipped ? "✓ Takılı" : collectionMode ? "İncele" : "Sende ✓"}</button>
        ) : (
          <button type="button" disabled={!affordable} onClick={(e) => { e.stopPropagation(); onBuy(); }}><span>◈</span> {item.price} {affordable ? "· Satın Al" : "· Coin gerekiyor"}</button>
        )}
      </div>
    </article>
  );
}

function RealRewards({ profile, onRedeemReward }) {
  const rewards = profile.rewardsCatalog || [];
  const pending = (profile.redemptions || []).filter((r) => !r.fulfilled);
  return (
    <div className="v4x-real-rewards">
      <div className="v4x-real-reward-info"><span>★</span><div><strong>Gerçek yaşam ödülleri</strong><p>Bunlar ebeveyn tarafından tanımlanır. Ders çalışırken kazandığın coinleri istersen gerçek yaşam ayrıcalıklarına dönüştürebilirsin.</p></div></div>
      <div className="v4x-reward-grid">
        {rewards.map((reward) => {
          const can = (profile.coins || 0) >= reward.cost;
          return <article key={reward.id}><span>✦</span><strong>{reward.label}</strong><small>◈ {reward.cost} coin</small><button disabled={!can} onClick={() => onRedeemReward?.(reward)}>{can ? "Ödülü Talep Et" : `${reward.cost - (profile.coins || 0)} coin daha`}</button></article>;
        })}
      </div>
      {pending.length > 0 && <div className="v4x-pending-rewards"><b>Ebeveyn onayı bekleyenler</b>{pending.map((r) => <span key={r.id}>{r.label}</span>)}</div>}
    </div>
  );
}

function rarityWeight(rarity) {
  return { common: 1, rare: 2, epic: 3, legendary: 4 }[rarity] || 0;
}
