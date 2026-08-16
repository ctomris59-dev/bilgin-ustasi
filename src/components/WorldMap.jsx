import { useMemo, useState } from "react";
import { WORLDS } from "../data/worlds";
import { getLevelInfo } from "../data/levels";
import { ITEMS } from "../data/avatarParts";
import { PETS, ROOM_ITEMS } from "../data/petsAndRoom";
import { playPop } from "../lib/sound";
import { getWorldAsset, getItemAsset } from "../data/gameAssets";

const FALLBACK_POINTS = [
  { x: 50, y: 90 },
  { x: 28, y: 80 },
  { x: 68, y: 72 },
  { x: 35, y: 63 },
  { x: 72, y: 54 },
  { x: 32, y: 45 },
  { x: 66, y: 37 },
  { x: 42, y: 29 },
  { x: 72, y: 22 },
  { x: 38, y: 15 },
  { x: 63, y: 8 },
  { x: 50, y: 3 },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getWorldRewards(worldId) {
  return [...ITEMS, ...PETS, ...ROOM_ITEMS].filter(
    (item) => item.world === worldId
  );
}

function buildSmoothPath(points) {
  if (!points?.length) return "";

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i += 1) {
    const previous = points[i - 1];
    const current = points[i];
    const middleY = (previous.y + current.y) / 2;

    path += ` C ${previous.x} ${middleY}, ${current.x} ${middleY}, ${current.x} ${current.y}`;
  }

  return path;
}

export default function WorldMap({ profile, onClose }) {
  const { current } = getLevelInfo(profile.xp);
  const currentLevel = current.level;
  const [selectedId, setSelectedId] = useState(null);

  const worldsWithStatus = useMemo(() => {
    const ordered = [...WORLDS].sort((a, b) => a.order - b.order);

    const activeWorld =
      [...ordered]
        .reverse()
        .find((world) => currentLevel >= world.unlockLevel) || ordered[0];

    return ordered.map((world, index) => {
      const fallback = FALLBACK_POINTS[index] || {
        x: 50,
        y: 90 - index * 7,
      };

      const x = clamp(Number(world.mapX ?? fallback.x), 12, 88);
      const y = clamp(Number(world.mapY ?? fallback.y), 5, 92);
      const unlocked = currentLevel >= world.unlockLevel;

      return {
        ...world,
        mapX: x,
        mapY: y,
        unlocked,
        isCurrent: activeWorld?.id === world.id,
        completed: unlocked && world.order < activeWorld.order,
        rewards: getWorldRewards(world.id),
      };
    });
  }, [currentLevel]);

  const selectedWorld = selectedId
    ? worldsWithStatus.find((world) => world.id === selectedId)
    : null;

  const currentWorld =
    worldsWithStatus.find((world) => world.isCurrent) || worldsWithStatus[0];

  const nextWorld = worldsWithStatus.find(
    (world) => !world.unlocked
  );

  const allPoints = worldsWithStatus.map((world) => ({
    x: world.mapX,
    y: world.mapY,
  }));

  const unlockedPoints = worldsWithStatus
    .filter((world) => world.unlocked)
    .map((world) => ({
      x: world.mapX,
      y: world.mapY,
    }));

  const fullRoute = buildSmoothPath(allPoints);
  const unlockedRoute = buildSmoothPath(unlockedPoints);

  const ownedItems = profile.unlockedItems || [];

  function selectWorld(worldId) {
    playPop();
    setSelectedId(worldId);
  }

  return (
    <div className="app-shell relative min-h-[84vh] pb-8">
      <style>{`
        @keyframes mapMistDrift {
          0%, 100% { transform: translate3d(-12px, 0, 0) scale(1); opacity: .32; }
          50% { transform: translate3d(18px, -7px, 0) scale(1.04); opacity: .48; }
        }

        @keyframes mapNodeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes mapBeacon {
          0% { transform: scale(.82); opacity: .65; }
          70%, 100% { transform: scale(1.55); opacity: 0; }
        }

        @keyframes routeGlow {
          0%, 100% { opacity: .55; }
          50% { opacity: 1; }
        }

        @keyframes cloudTravel {
          0% { transform: translateX(-18px); }
          50% { transform: translateX(18px); }
          100% { transform: translateX(-18px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .map-motion { animation: none !important; }
        }
      `}</style>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="mb-4 flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#52E3C2]">
            Keşif Haritası
          </p>

          <h1
            className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Bilgi Dünyası
          </h1>

          <p className="mt-1 text-xs font-medium text-[#8793B4]">
            Seviye {currentLevel} · {current.title}
          </p>
        </div>

        <button
          onClick={onClose}
          className="glass-card flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm text-[#C5CEE7] transition duration-200 hover:-translate-y-0.5 hover:text-white"
          aria-label="Haritayı kapat"
        >
          ×
        </button>
      </header>

      {/* =====================================================
          CURRENT WORLD SUMMARY
      ====================================================== */}

      <section
        className="glass-card relative mb-4 overflow-hidden p-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(82,227,194,.10), rgba(139,108,255,.065))",
        }}
      >
        <div
          className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full blur-3xl"
          style={{
            background: currentWorld?.accent || currentWorld?.color || "#52E3C2",
            opacity: 0.12,
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-black"
            style={{
              color: currentWorld?.accent || "#52E3C2",
              background: `${currentWorld?.accent || "#52E3C2"}16`,
              border: `1px solid ${currentWorld?.accent || "#52E3C2"}30`,
            }}
          >
            {currentWorld?.emoji || "✦"}

            <span
              className="map-motion absolute inset-0 rounded-2xl border"
              style={{
                borderColor: `${currentWorld?.accent || "#52E3C2"}40`,
                animation: "mapBeacon 2.3s ease-out infinite",
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#8793B4]">
              Şu an bulunduğun bölge
            </p>

            <p className="mt-0.5 truncate text-sm font-black text-white">
              {currentWorld?.title}
            </p>

            <p className="mt-1 text-[10px] font-medium text-[#8793B4]">
              {nextWorld
                ? `Sonraki bölge Seviye ${nextWorld.unlockLevel}'de açılır.`
                : "Tüm bölgeleri keşfettin."}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-wider text-[#687494]">
              Bölge
            </p>
            <p className="mt-0.5 text-lg font-black text-[#52E3C2]">
              {currentWorld?.order || 1}/{worldsWithStatus.length}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAP
      ====================================================== */}

      <section
        className="glass-card relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,22,46,.96) 0%, rgba(10,24,43,.96) 45%, rgba(9,20,31,.98) 100%)",
        }}
      >
        {/* sky */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[34%]"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(139,108,255,.16), transparent 55%)",
          }}
        />

        {/* moon / distant light */}
        <div
          className="pointer-events-none absolute right-[11%] top-[4%] h-16 w-16 rounded-full blur-[1px]"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(255,255,255,.84), rgba(178,195,255,.25) 35%, rgba(139,108,255,.08) 58%, transparent 72%)",
            boxShadow: "0 0 55px rgba(168,178,255,.12)",
          }}
        />

        {/* clouds */}
        <div
          className="map-motion pointer-events-none absolute left-[8%] top-[8%] h-8 w-28 rounded-full blur-xl"
          style={{
            background: "rgba(163,184,220,.09)",
            animation: "cloudTravel 12s ease-in-out infinite",
          }}
        />

        <div
          className="map-motion pointer-events-none absolute right-[20%] top-[20%] h-7 w-24 rounded-full blur-xl"
          style={{
            background: "rgba(163,184,220,.07)",
            animation: "cloudTravel 15s ease-in-out infinite reverse",
          }}
        />

        {/* distant land masses */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-[34%] w-[48%] opacity-75"
          style={{
            clipPath:
              "polygon(0 45%, 18% 28%, 31% 40%, 44% 20%, 57% 38%, 72% 24%, 100% 50%, 100% 100%, 0 100%)",
            background:
              "linear-gradient(180deg, rgba(35,76,73,.35), rgba(14,42,42,.88))",
          }}
        />

        <div
          className="pointer-events-none absolute bottom-0 right-0 h-[39%] w-[58%] opacity-80"
          style={{
            clipPath:
              "polygon(0 48%, 17% 37%, 27% 48%, 43% 24%, 57% 40%, 70% 20%, 82% 36%, 100% 28%, 100% 100%, 0 100%)",
            background:
              "linear-gradient(180deg, rgba(32,64,72,.34), rgba(14,35,41,.92))",
          }}
        />

        {/* fog for locked upper region */}
        {nextWorld && (
          <>
            <div
              className="map-motion pointer-events-none absolute left-[-8%] top-[1%] h-[34%] w-[75%] rounded-full blur-[35px]"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(172,180,205,.11), rgba(109,119,150,.04) 55%, transparent 74%)",
                animation: "mapMistDrift 9s ease-in-out infinite",
              }}
            />

            <div
              className="map-motion pointer-events-none absolute right-[-15%] top-[10%] h-[30%] w-[70%] rounded-full blur-[32px]"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(178,187,214,.10), rgba(104,114,145,.035) 58%, transparent 75%)",
                animation: "mapMistDrift 11s ease-in-out infinite reverse",
              }}
            />
          </>
        )}

        {/* map canvas */}
        <div className="relative h-[930px] sm:h-[1040px]">
          {/* route */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="routeUnlocked" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#52E3C2" />
                <stop offset="48%" stopColor="#52E3FF" />
                <stop offset="100%" stopColor="#A98CFF" />
              </linearGradient>

              <filter id="routeGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="0.7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d={fullRoute}
              fill="none"
              stroke="rgba(255,255,255,.10)"
              strokeWidth="0.75"
              strokeDasharray="1.7 1.4"
              vectorEffect="non-scaling-stroke"
            />

            {unlockedPoints.length > 1 && (
              <path
                className="map-motion"
                d={unlockedRoute}
                fill="none"
                stroke="url(#routeUnlocked)"
                strokeWidth="1.05"
                strokeLinecap="round"
                filter="url(#routeGlowFilter)"
                vectorEffect="non-scaling-stroke"
                style={{ animation: "routeGlow 3s ease-in-out infinite" }}
              />
            )}
          </svg>

          {/* world nodes */}
          {worldsWithStatus.map((world, index) => {
            const accent = world.accent || world.color || "#A98CFF";
            const labelOnLeft = world.mapX > 54;

            return (
              <div
                key={world.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${world.mapX}%`,
                  top: `${world.mapY}%`,
                }}
              >
                <button
                  onClick={() => selectWorld(world.id)}
                  className={`group relative flex items-center ${
                    labelOnLeft ? "flex-row-reverse" : "flex-row"
                  } gap-2.5 text-left`}
                  aria-label={`${world.title}${world.unlocked ? "" : ", kilitli"}`}
                >
                  {/* node */}
                  <div
                    className={`map-motion relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-lg font-black transition duration-300 group-hover:-translate-y-1 sm:h-14 sm:w-14 ${
                      world.isCurrent ? "animate-pulse-glow" : ""
                    }`}
                    style={{
                      color: world.unlocked ? accent : "#687494",
                      background: world.unlocked
                        ? `linear-gradient(145deg, ${accent}24, rgba(10,16,33,.88))`
                        : "linear-gradient(145deg, rgba(99,108,132,.14), rgba(9,14,28,.90))",
                      borderColor: world.unlocked
                        ? `${accent}55`
                        : "rgba(124,134,158,.16)",
                      boxShadow: world.isCurrent
                        ? `0 0 32px ${accent}24, inset 0 1px 0 rgba(255,255,255,.08)`
                        : "0 10px 24px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.04)",
                      animation: world.isCurrent
                        ? "mapNodeFloat 2.8s ease-in-out infinite"
                        : undefined,
                    }}
                  >
                    {world.unlocked ? world.emoji : "×"}

                    {world.completed && (
                      <span
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-black"
                        style={{
                          color: "#082119",
                          background: "#52E3C2",
                          borderColor: "rgba(255,255,255,.35)",
                          boxShadow: "0 0 14px rgba(82,227,194,.28)",
                        }}
                      >
                        ✓
                      </span>
                    )}

                    {world.isCurrent && (
                      <>
                        <span
                          className="map-motion absolute inset-[-6px] rounded-[20px] border"
                          style={{
                            borderColor: `${accent}55`,
                            animation: "mapBeacon 2.2s ease-out infinite",
                          }}
                        />

                        <span
                          className="absolute -bottom-5 whitespace-nowrap rounded-full px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.13em]"
                          style={{
                            color: accent,
                            background: "rgba(7,11,29,.88)",
                            border: `1px solid ${accent}25`,
                          }}
                        >
                          Sen buradasın
                        </span>
                      </>
                    )}
                  </div>

                  {/* label */}
                  <div
                    className={`max-w-[128px] rounded-xl border px-2.5 py-2 backdrop-blur-md transition duration-300 group-hover:border-white/20 group-hover:bg-[#10182D]/90 sm:max-w-[170px] ${
                      labelOnLeft ? "text-right" : "text-left"
                    }`}
                    style={{
                      background: world.unlocked
                        ? "rgba(7,13,29,.72)"
                        : "rgba(7,13,29,.52)",
                      borderColor: world.isCurrent
                        ? `${accent}35`
                        : "rgba(255,255,255,.075)",
                      opacity: world.unlocked ? 1 : 0.55,
                    }}
                  >
                    <p
                      className="truncate text-[10px] font-black sm:text-[11px]"
                      style={{
                        color: world.unlocked ? "#F4F7FF" : "#7B86A4",
                      }}
                    >
                      {world.order}. {world.shortTitle || world.title}
                    </p>

                    <p
                      className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.1em]"
                      style={{
                        color: world.unlocked ? accent : "#687494",
                      }}
                    >
                      {world.completed
                        ? "Tamamlandı"
                        : world.isCurrent
                        ? "Aktif bölge"
                        : world.unlocked
                        ? "Keşfedildi"
                        : `Seviye ${world.unlockLevel}`}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}

          {/* small environmental markers */}
          <MapDecoration left="12%" top="71%" symbol="♟" opacity={0.12} />
          <MapDecoration left="86%" top="64%" symbol="▲" opacity={0.13} />
          <MapDecoration left="14%" top="36%" symbol="≈" opacity={0.13} />
          <MapDecoration left="87%" top="31%" symbol="◆" opacity={0.10} />
          <MapDecoration left="17%" top="14%" symbol="✦" opacity={0.16} />
        </div>

        {/* legend */}
        <div className="relative z-30 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/[0.06] bg-[#070D1D]/75 px-3 py-3 backdrop-blur-xl">
          <LegendDot color="#52E3C2" label="Tamamlandı" />
          <LegendDot color="#A98CFF" label="Aktif" pulse />
          <LegendDot color="#687494" label="Kilitli" />
        </div>
      </section>

      {/* =====================================================
          SELECTED WORLD SHEET
      ====================================================== */}

      {selectedWorld && (
        <WorldDetailSheet
          world={selectedWorld}
          ownedItems={ownedItems}
          currentLevel={currentLevel}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

function WorldDetailSheet({
  world,
  ownedItems,
  currentLevel,
  onClose,
}) {
  const accent = world.accent || world.color || "#A98CFF";
  const rewards = world.rewards || [];

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center">
      <button
        className="absolute inset-0 cursor-default bg-[#030610]/70 backdrop-blur-[5px]"
        onClick={onClose}
        aria-label="Bölge detayını kapat"
      />

      <section
        className="animate-pop relative z-10 max-h-[82vh] w-full max-w-lg overflow-y-auto rounded-[26px] border p-5 shadow-2xl sm:p-6"
        style={{
          background:
            "linear-gradient(155deg, rgba(21,30,61,.98), rgba(7,12,28,.99))",
          borderColor: `${accent}35`,
          boxShadow: `0 28px 90px rgba(0,0,0,.48), 0 0 45px ${accent}10`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-60 w-60 rounded-full blur-3xl"
          style={{ background: accent, opacity: 0.09 }}
        />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-2xl font-black"
              style={{
                color: world.unlocked ? accent : "#687494",
                background: world.unlocked
                  ? `${accent}16`
                  : "rgba(104,116,146,.08)",
                borderColor: world.unlocked
                  ? `${accent}35`
                  : "rgba(104,116,146,.14)",
              }}
            >
              {world.unlocked ? world.emoji : "×"}
            </div>

            <div className="min-w-0">
              <p
                className="text-[9px] font-black uppercase tracking-[0.19em]"
                style={{ color: world.unlocked ? accent : "#687494" }}
              >
                {world.completed
                  ? "Keşfedilmiş Bölge"
                  : world.isCurrent
                  ? "Aktif Bölge"
                  : world.unlocked
                  ? "Açık Bölge"
                  : "Kilitli Bölge"}
              </p>

              <h2
                className="mt-1 truncate text-xl font-black text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {world.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-sm text-[#8793B4] transition hover:bg-white/[0.07] hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="relative z-10 mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20">
          <img
            src={getWorldAsset(world.id)}
            alt=""
            className={`h-36 w-full object-cover transition duration-500 ${world.unlocked ? "" : "grayscale opacity-45 blur-[1px]"}`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07101F]/75 via-transparent to-transparent" />
          <span
            className="absolute bottom-3 left-3 rounded-xl border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] backdrop-blur-md"
            style={{
              color: world.unlocked ? accent : "#8793B4",
              background: "rgba(7,11,29,.72)",
              borderColor: world.unlocked ? `${accent}30` : "rgba(255,255,255,.08)",
            }}
          >
            Bölge {world.order}
          </span>
        </div>

        <p className="relative z-10 mt-4 text-sm font-medium leading-relaxed text-[#A5AEC6]">
          {world.unlocked
            ? world.blurb
            : `Bu bölge Seviye ${world.unlockLevel}'de açılır. Şu an Seviye ${currentLevel}'desin.`}
        </p>

        {!world.unlocked && (
          <div className="relative z-10 mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-[#8793B4]">
                ◇
              </div>

              <div className="flex-1">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#687494]">
                  Açılma koşulu
                </p>
                <p className="mt-0.5 text-xs font-black text-white">
                  Seviye {world.unlockLevel}
                </p>
              </div>

              <p className="text-xs font-black text-[#8793B4]">
                {Math.max(0, world.unlockLevel - currentLevel)} seviye kaldı
              </p>
            </div>
          </div>
        )}

        <div className="relative z-10 my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.07]" />
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#687494]">
            Bölge Ödülleri
          </p>
          <div className="h-px flex-1 bg-white/[0.07]" />
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-2.5">
          {rewards.map((item) => {
            const owned = ownedItems.includes(item.id);

            return (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-2xl border p-3"
                style={{
                  background: owned
                    ? "rgba(82,227,194,.07)"
                    : "rgba(255,255,255,.028)",
                  borderColor: owned
                    ? "rgba(82,227,194,.20)"
                    : "rgba(255,255,255,.065)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025]">
                    <img
                      src={getItemAsset(item)}
                      alt=""
                      className="h-[88%] w-[88%] object-contain drop-shadow-[0_6px_6px_rgba(0,0,0,.3)]"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-black text-white">
                      {item.label}
                    </p>

                    <p
                      className="mt-1 text-[9px] font-bold"
                      style={{ color: owned ? "#52E3C2" : "#8793B4" }}
                    >
                      {owned
                        ? "Sende ✓"
                        : item.legendary
                        ? "Kusursuz görev ödülü"
                        : `◈ ${item.price ?? 0}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {rewards.length === 0 && (
            <div className="col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 text-center">
              <p className="text-xs font-bold text-[#8793B4]">
                Bu bölgeye özel koleksiyon ödülü henüz yok.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="sticker-btn relative z-10 mt-5 w-full py-3.5 text-sm font-black"
        >
          Haritaya Dön
        </button>
      </section>
    </div>
  );
}

function LegendDot({ color, label, pulse = false }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        <span
          className="absolute h-2 w-2 rounded-full"
          style={{ background: color }}
        />
        {pulse && (
          <span
            className="map-motion absolute h-2 w-2 rounded-full"
            style={{
              background: color,
              animation: "mapBeacon 2s ease-out infinite",
            }}
          />
        )}
      </span>

      <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#687494]">
        {label}
      </span>
    </div>
  );
}

function MapDecoration({ left, top, symbol, opacity }) {
  return (
    <span
      className="pointer-events-none absolute text-xl font-black"
      style={{
        left,
        top,
        color: "#8EA3C7",
        opacity,
      }}
    >
      {symbol}
    </span>
  );
}
