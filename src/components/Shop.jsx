import { useMemo, useState } from "react";
import { ITEMS } from "../data/avatarParts";
import { ALL_PET_ROOM_ITEMS } from "../data/petsAndRoom";
import { WORLDS, getWorldById } from "../data/worlds";
import { getLevelInfo } from "../data/levels";
import { playPop } from "../lib/sound";

const ALL_SHOP_ITEMS = [...ITEMS, ...ALL_PET_ROOM_ITEMS];

const FILTERS = [
  { id: "all", label: "Tümü", icon: GridIcon },
  { id: "clothes", label: "Ekipman", icon: OutfitIcon },
  { id: "pets", label: "Dostlar", icon: PawIcon },
  { id: "room", label: "Üs", icon: HomeIcon },
];

const SLOT_META = {
  outfit: { label: "Kıyafet", icon: OutfitIcon },
  shoes: { label: "Ayakkabı", icon: BootIcon },
  headwear: { label: "Başlık", icon: CompassIcon },
  face: { label: "Aksesuar", icon: SparkIcon },
  petSpecies: { label: "Keşif Dostu", icon: PawIcon },
  petAccessory: { label: "Dost Aksesuarı", icon: PawIcon },
  wallpaper: { label: "Duvar", icon: HomeIcon },
  rug: { label: "Halı", icon: HomeIcon },
  desk: { label: "Masa", icon: DeskIcon },
  lamp: { label: "Aydınlatma", icon: LampIcon },
  plant: { label: "Bitki", icon: LeafIcon },
  poster: { label: "Poster", icon: MapIcon },
};

export default function Shop({ profile, onBuyItem, onRedeemReward }) {
  const [filter, setFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortMode, setSortMode] = useState("recommended");
  const [justPurchased, setJustPurchased] = useState(null);

  const currentLevel = getLevelInfo(profile.xp || 0).current.level;
  const unlockedItems = profile.unlockedItems || [];
  const coins = profile.coins || 0;

  const filteredItems = useMemo(() => {
    const result = ALL_SHOP_ITEMS.filter((item) => {
      if (item.legendary) return false;

      if (filter === "clothes") {
        return ["outfit", "shoes", "headwear", "face"].includes(item.slot);
      }

      if (filter === "pets") {
        return Boolean(item.type) || item.slot === "petAccessory";
      }

      if (filter === "room") {
        return ["wallpaper", "rug", "desk", "lamp", "plant", "poster"].includes(item.slot);
      }

      return true;
    });

    return [...result].sort((a, b) => {
      const aOwned = unlockedItems.includes(a.id);
      const bOwned = unlockedItems.includes(b.id);

      if (aOwned !== bOwned) return aOwned ? 1 : -1;

      if (sortMode === "price-low") return a.price - b.price;
      if (sortMode === "price-high") return b.price - a.price;

      const aWorld = getWorldById?.(a.world)?.unlockLevel || 1;
      const bWorld = getWorldById?.(b.world)?.unlockLevel || 1;

      if (aWorld !== bWorld) return aWorld - bWorld;
      return a.price - b.price;
    });
  }, [filter, sortMode, unlockedItems]);

  const purchasableCount = filteredItems.filter(
    (item) => !unlockedItems.includes(item.id) && coins >= item.price
  ).length;

  function chooseFilter(id) {
    playPop();
    setFilter(id);
  }

  function openItem(item) {
    playPop();
    setSelectedItem(item);
  }

  function buy(item) {
    if (!onBuyItem) return;
    if (unlockedItems.includes(item.id)) return;
    if (coins < item.price) return;

    onBuyItem(item);
    setJustPurchased(item.id);

    window.setTimeout(() => {
      setJustPurchased(null);
      setSelectedItem(null);
    }, 750);
  }

  return (
    <div className="app-shell relative space-y-5 pb-28">
      <StoreParticles />

      {/* =====================================================
          HERO / WALLET
      ====================================================== */}
      <section
        className="glass-card relative overflow-hidden p-5 sm:p-6"
        style={{
          background:
            "linear-gradient(145deg, rgba(28,35,73,.91), rgba(8,13,30,.96))",
        }}
      >
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "#8B6CFF", opacity: 0.12 }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full blur-3xl"
          style={{ background: "#52E3FF", opacity: 0.07 }}
        />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#A98CFF]">
              Kaşif Dükkânı
            </p>
            <h1
              className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Kazandıklarını dünyana taşı
            </h1>
            <p className="mt-2 max-w-sm text-xs font-medium leading-relaxed text-[#8793B4]">
              Görevlerden kazandığın coinlerle karakterini, keşif dostunu ve üssünü geliştir.
            </p>
          </div>

          <div className="relative shrink-0">
            <div
              className="absolute inset-0 rounded-2xl blur-xl"
              style={{ background: "rgba(255,209,102,.12)" }}
            />
            <div
              className="relative rounded-2xl border px-4 py-3 text-right"
              style={{
                background: "rgba(255,209,102,.075)",
                borderColor: "rgba(255,209,102,.20)",
              }}
            >
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#B6A067]">
                Cüzdan
              </p>
              <div className="mt-1 flex items-center justify-end gap-1.5">
                <CoinIcon className="h-4 w-4 text-[#FFD166]" />
                <span
                  className="text-xl font-black text-[#FFD166]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {coins}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-5 grid grid-cols-3 gap-2">
          <MiniStat label="Seviye" value={currentLevel} icon={CompassIcon} color="#A98CFF" />
          <MiniStat label="Koleksiyon" value={unlockedItems.length} icon={CollectionIcon} color="#52E3C2" />
          <MiniStat label="Alınabilir" value={purchasableCount} icon={CoinIcon} color="#FFD166" />
        </div>
      </section>

      {/* =====================================================
          FILTERS
      ====================================================== */}
      <section>
        <div className="mb-3 flex items-end justify-between gap-3 px-1">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.19em] text-[#687494]">
              Koleksiyon
            </p>
            <h2
              className="mt-0.5 text-lg font-black text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Dükkân Envanteri
            </h2>
          </div>

          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#10172D] px-2.5 py-2 text-[10px] font-bold text-[#A5AEC6] outline-none"
            aria-label="Ürünleri sırala"
          >
            <option value="recommended">Önerilen</option>
            <option value="price-low">Fiyat ↑</option>
            <option value="price-high">Fiyat ↓</option>
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((entry) => {
            const Icon = entry.icon;
            const active = filter === entry.id;

            return (
              <button
                key={entry.id}
                onClick={() => chooseFilter(entry.id)}
                className="group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-2xl border px-3.5 py-2.5 transition-all duration-300"
                style={{
                  color: active ? "#FFFFFF" : "#8793B4",
                  background: active
                    ? "linear-gradient(135deg, rgba(139,108,255,.22), rgba(82,227,255,.07))"
                    : "rgba(255,255,255,.035)",
                  borderColor: active
                    ? "rgba(169,140,255,.30)"
                    : "rgba(255,255,255,.075)",
                  boxShadow: active ? "0 0 25px rgba(139,108,255,.08)" : "none",
                }}
              >
                {active && (
                  <span
                    className="absolute inset-x-3 top-0 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, #A98CFF, transparent)",
                    }}
                  />
                )}
                <Icon className="h-4 w-4" />
                <span className="text-[11px] font-black">{entry.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          PRODUCT GRID
      ====================================================== */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {filteredItems.map((item, index) => {
          const isOwned = unlockedItems.includes(item.id);
          const canAfford = coins >= item.price;
          const world = getWorldById?.(item.world) || WORLDS.find((w) => w.id === item.world);
          const worldLevel = world?.unlockLevel || 1;
          const isFutureWorld = worldLevel > currentLevel;
          const accent = item.color || world?.accent || "#A98CFF";
          const SlotIcon = SLOT_META[item.slot]?.icon || SparkIcon;
          const boughtNow = justPurchased === item.id;

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => openItem(item)}
              className={`glass-card group relative flex min-h-[230px] flex-col overflow-hidden p-3 text-left transition-all duration-300 hover:-translate-y-1 ${
                boughtNow ? "animate-pop" : ""
              }`}
              style={{
                borderColor: boughtNow
                  ? `${accent}75`
                  : isOwned
                  ? "rgba(82,227,194,.17)"
                  : "rgba(255,255,255,.09)",
                boxShadow: boughtNow
                  ? `0 18px 45px rgba(0,0,0,.28), 0 0 32px ${accent}24`
                  : undefined,
              }}
            >
              {/* item visual */}
              <div
                className="relative flex h-[105px] items-center justify-center overflow-hidden rounded-2xl border"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${accent}20, rgba(255,255,255,.025) 55%, rgba(6,10,23,.45) 100%)`,
                  borderColor: `${accent}22`,
                }}
              >
                <div
                  className="absolute h-20 w-20 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: accent, opacity: 0.08 }}
                />

                <div
                  className="absolute bottom-2 h-4 w-16 rounded-[50%] blur-sm"
                  style={{ background: `${accent}22` }}
                />

                <div
                  className="relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105"
                  style={{
                    color: accent,
                    background: "rgba(7,11,29,.66)",
                    borderColor: `${accent}35`,
                    boxShadow: `0 10px 30px rgba(0,0,0,.25), 0 0 22px ${accent}13`,
                  }}
                >
                  {item.emoji ? (
                    <span className="text-3xl">{item.emoji}</span>
                  ) : (
                    <SlotIcon className="h-7 w-7" />
                  )}
                </div>

                <span
                  className="absolute left-2 top-2 rounded-lg px-2 py-1 text-[7px] font-black uppercase tracking-[0.12em]"
                  style={{
                    color: isFutureWorld ? "#8793B4" : accent,
                    background: "rgba(7,11,29,.72)",
                    border: "1px solid rgba(255,255,255,.06)",
                  }}
                >
                  {isFutureWorld ? `Sv. ${worldLevel}` : world?.shortTitle || world?.title || "Keşif"}
                </span>

                {isOwned && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-lg border border-[#52E3C2]/20 bg-[#52E3C2]/10 text-[10px] font-black text-[#52E3C2]">
                    ✓
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-1 flex-col">
                <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#687494]">
                  {SLOT_META[item.slot]?.label || "Koleksiyon"}
                </p>
                <h3 className="mt-1 line-clamp-2 min-h-[34px] text-[13px] font-black leading-[1.25] text-white">
                  {item.label}
                </h3>

                <div className="mt-auto pt-3">
                  {isOwned ? (
                    <div className="flex items-center justify-between rounded-xl border border-[#52E3C2]/10 bg-[#52E3C2]/[0.055] px-2.5 py-2">
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#52E3C2]">
                        Koleksiyonda
                      </span>
                      <span className="text-[#52E3C2]">✓</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl border border-white/[0.065] bg-white/[0.03] px-2.5 py-2">
                      <span className="text-[8px] font-bold text-[#687494]">
                        {canAfford ? "Satın alınabilir" : "Coin gerekiyor"}
                      </span>
                      <span
                        className="flex items-center gap-1 text-[11px] font-black"
                        style={{ color: canAfford ? "#FFD166" : "#8793B4" }}
                      >
                        <CoinIcon className="h-3.5 w-3.5" />
                        {item.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {filteredItems.length === 0 && (
        <div className="glass-card p-8 text-center">
          <SparkIcon className="mx-auto h-7 w-7 text-[#687494]" />
          <p className="mt-3 text-sm font-black text-white">Bu bölüm henüz boş</p>
          <p className="mt-1 text-xs font-medium text-[#8793B4]">
            Yeni keşif ödülleri eklendiğinde burada görünecek.
          </p>
        </div>
      )}

      {(profile.rewardsCatalog || []).length > 0 && (
        <section className="glass-card p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#FFD166]">Gerçek Yaşam Ödülleri</p>
              <h2 className="mt-1 text-sm font-black text-white">Coinlerini deneyime dönüştür</h2>
            </div>
            <span className="game-chip">Ebeveyn onaylı</span>
          </div>
          <div className="mt-3 space-y-2">
            {(profile.rewardsCatalog || []).map((reward) => {
              const canRedeem = coins >= reward.cost;
              return (
                <div key={reward.id} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD166]/10 text-[#FFD166]">◆</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black text-white">{reward.label}</p>
                    <p className="mt-1 text-[9px] text-[#8793B4]">Ebeveyn panelinden teslim edilir.</p>
                  </div>
                  <button
                    type="button"
                    disabled={!canRedeem || !onRedeemReward}
                    onClick={() => { playPop(); onRedeemReward?.(reward); }}
                    className="rounded-xl border border-[#FFD166]/15 bg-[#FFD166]/[0.07] px-3 py-2 text-[10px] font-black text-[#FFD166] disabled:opacity-35"
                  >
                    ◈ {reward.cost}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================
          ITEM DETAIL SHEET
      ====================================================== */}
      {selectedItem && (
        <ItemSheet
          item={selectedItem}
          coins={coins}
          owned={unlockedItems.includes(selectedItem.id)}
          currentLevel={currentLevel}
          justPurchased={justPurchased === selectedItem.id}
          onClose={() => setSelectedItem(null)}
          onBuy={() => buy(selectedItem)}
        />
      )}
    </div>
  );
}

function ItemSheet({ item, coins, owned, currentLevel, justPurchased, onClose, onBuy }) {
  const world = getWorldById?.(item.world) || WORLDS.find((w) => w.id === item.world);
  const accent = item.color || world?.accent || "#A98CFF";
  const SlotIcon = SLOT_META[item.slot]?.icon || SparkIcon;
  const canAfford = coins >= item.price;
  const worldLevel = world?.unlockLevel || 1;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Ürün detayını kapat"
        onClick={onClose}
        className="absolute inset-0 bg-[#02040D]/75 backdrop-blur-md"
      />

      <section
        className="animate-pop relative z-10 w-full max-w-md overflow-hidden rounded-t-[28px] border border-white/[0.10] p-5 shadow-2xl sm:rounded-[28px]"
        style={{
          background:
            "linear-gradient(155deg, rgba(24,32,64,.98), rgba(7,11,27,.99))",
        }}
      >
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
          style={{ background: accent, opacity: 0.11 }}
        />

        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#687494]">
                {world?.title || "Keşif Koleksiyonu"}
              </p>
              <p className="mt-1 text-[10px] font-black" style={{ color: accent }}>
                {SLOT_META[item.slot]?.label || "Özel Eşya"}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[#8793B4] transition hover:bg-white/[0.08] hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div
            className="relative flex h-44 items-center justify-center overflow-hidden rounded-3xl border"
            style={{
              background: `radial-gradient(circle at 50% 45%, ${accent}25, rgba(255,255,255,.025) 52%, rgba(5,9,22,.62) 100%)`,
              borderColor: `${accent}2B`,
            }}
          >
            <div
              className="absolute h-36 w-36 rounded-full blur-3xl"
              style={{ background: accent, opacity: 0.11 }}
            />
            <div
              className={`relative flex h-24 w-24 items-center justify-center rounded-[26px] border ${
                justPurchased ? "animate-level-ring" : "animate-float"
              }`}
              style={{
                color: accent,
                background: "rgba(7,11,29,.68)",
                borderColor: `${accent}42`,
                boxShadow: `0 24px 60px rgba(0,0,0,.32), 0 0 38px ${accent}18`,
              }}
            >
              {item.emoji ? (
                <span className="text-5xl">{item.emoji}</span>
              ) : (
                <SlotIcon className="h-12 w-12" />
              )}
            </div>
            <div
              className="absolute bottom-6 h-5 w-28 rounded-[50%] blur-md"
              style={{ background: `${accent}20` }}
            />
          </div>

          <h2
            className="mt-5 text-xl font-black leading-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {item.label}
          </h2>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <DetailStat
              label="Bölge"
              value={world?.shortTitle || world?.title || "Keşif"}
              icon={MapIcon}
              color={world?.accent || accent}
            />
            <DetailStat
              label="Keşif Seviyesi"
              value={currentLevel >= worldLevel ? "Açık" : `Sv. ${worldLevel}`}
              icon={CompassIcon}
              color={currentLevel >= worldLevel ? "#52E3C2" : "#A98CFF"}
            />
          </div>

          {justPurchased ? (
            <div className="animate-pop mt-5 rounded-2xl border border-[#52E3C2]/20 bg-[#52E3C2]/[0.07] p-4 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#52E3C2]/10 text-lg font-black text-[#52E3C2]">
                ✓
              </div>
              <p className="mt-2 text-sm font-black text-[#72E9B2]">Koleksiyona eklendi</p>
              <p className="mt-1 text-[10px] font-medium text-[#8793B4]">
                Yeni eşyan artık karakter veya üs ekranında kullanılabilir.
              </p>
            </div>
          ) : owned ? (
            <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-[#52E3C2]/15 bg-[#52E3C2]/[0.055] py-3.5 text-xs font-black text-[#52E3C2]">
              <span>✓</span>
              Koleksiyonunda
            </div>
          ) : (
            <>
              {!canAfford && (
                <div className="mt-4 rounded-2xl border border-[#FFD166]/10 bg-[#FFD166]/[0.04] p-3 text-[10px] font-semibold leading-relaxed text-[#9FA8BF]">
                  Bu eşya için <strong className="text-[#FFD166]">{item.price - coins} coin</strong> daha gerekiyor. Yeni coinleri yalnızca öğrenme görevlerini tamamlayarak kazanabilirsin.
                </div>
              )}

              <button
                type="button"
                onClick={onBuy}
                disabled={!canAfford}
                className="sticker-btn mt-5 w-full py-3.5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-40"
                style={
                  canAfford
                    ? {
                        background:
                          "linear-gradient(135deg, #E7B94D, #FFD166)",
                        color: "#171326",
                        boxShadow:
                          "0 10px 28px rgba(255,209,102,.16), inset 0 1px 0 rgba(255,255,255,.3)",
                      }
                    : undefined
                }
              >
                <span className="flex items-center justify-center gap-2">
                  <CoinIcon className="h-4 w-4" />
                  {canAfford ? `${item.price} Coin ile Al` : `${item.price} Coin Gerekli`}
                </span>
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color }} />
        <div className="min-w-0">
          <p className="text-sm font-black text-white">{value}</p>
          <p className="truncate text-[7px] font-black uppercase tracking-[0.13em] text-[#687494]">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailStat({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" style={{ color }} />
        <div className="min-w-0">
          <p className="truncate text-[11px] font-black text-white">{value}</p>
          <p className="mt-0.5 text-[7px] font-black uppercase tracking-[0.12em] text-[#687494]">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function StoreParticles() {
  return (
    <>
      <span className="magic-particle" style={{ left: "6%", top: "7%" }} />
      <span
        className="magic-particle"
        style={{ left: "91%", top: "16%", animationDelay: ".8s" }}
      />
      <span
        className="magic-particle"
        style={{ left: "13%", top: "48%", animationDelay: "1.8s" }}
      />
      <span
        className="magic-particle"
        style={{ left: "86%", top: "72%", animationDelay: "2.7s" }}
      />
    </>
  );
}

function IconBase({ children, className = "h-5 w-5", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

function GridIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </IconBase>
  );
}

function OutfitIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M8 4 5 6.3 2.8 9.8 6 12v8h12v-8l3.2-2.2L19 6.3 16 4c-.8 1.6-2 2.4-4 2.4S8.8 5.6 8 4Z" />
    </IconBase>
  );
}

function PawIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 13.2c-3.1 0-5.7 2.2-5.7 4.6 0 1.7 1.4 2.7 3 2.2 1.7-.6 3.7-.6 5.4 0 1.6.5 3-.5 3-2.2 0-2.4-2.6-4.6-5.7-4.6Z" />
      <circle cx="6" cy="10" r="2" />
      <circle cx="18" cy="10" r="2" />
      <circle cx="9" cy="5.5" r="2" />
      <circle cx="15" cy="5.5" r="2" />
    </IconBase>
  );
}

function HomeIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9" />
      <path d="M9 20v-6h6v6" />
    </IconBase>
  );
}

function BootIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M8 3v9.2c0 1.5-1 2.8-2.4 3.2L3 16.2V20h17v-3.5c-2.8 0-5.2-.8-7-2.4V3H8Z" />
    </IconBase>
  );
}

function CompassIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" />
    </IconBase>
  );
}

function SparkIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </IconBase>
  );
}

function DeskIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M3 8h18v5H3z" />
      <path d="M5 13v8M19 13v8M9 13v4h6v-4" />
    </IconBase>
  );
}

function LampIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M8 4h8l2 7H6l2-7Z" />
      <path d="M12 11v7M8 21h8M9 18h6" />
    </IconBase>
  );
}

function LeafIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M20 4C12 4 6 8 6 14c0 3 2 5 5 5 6 0 9-7 9-15Z" />
      <path d="M4 21c3-7 7-10 13-13" />
    </IconBase>
  );
}

function MapIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m3 6 5-2 8 2 5-2v14l-5 2-8-2-5 2V6Z" />
      <path d="M8 4v14M16 6v14" />
    </IconBase>
  );
}

function CoinIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9.5c0-1.2 1.2-2 3-2s3 .8 3 2-1 1.8-3 2-3 .8-3 2 1.2 2 3 2 3-.8 3-2" />
      <path d="M12 5.5v13" />
    </IconBase>
  );
}

function CollectionIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 9h8M8 13h5M8 17h7" />
    </IconBase>
  );
}

function CloseIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconBase>
  );
}
