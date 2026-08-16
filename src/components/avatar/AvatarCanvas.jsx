import { ITEMS } from "../../data/avatarParts";
import { getAvatarPreset, getItemAsset } from "../../data/gameAssets";

export default function AvatarCanvas({ avatar = {}, size = 180 }) {
  const preset = getAvatarPreset(avatar);
  const headwear = ITEMS.find((item) => item.id === avatar.headwear);
  const face = ITEMS.find((item) => item.id === avatar.face);

  return (
    <div
      className="game-avatar relative isolate flex items-end justify-center"
      style={{ width: size, height: size * 1.18 }}
      role="img"
      aria-label="Kaşif avatarı"
    >
      <div
        className="pointer-events-none absolute bottom-[5%] left-1/2 h-[22%] w-[72%] -translate-x-1/2 rounded-full blur-2xl"
        style={{ background: avatar.hairColor || "#52E3FF", opacity: 0.16 }}
      />
      <div className="pointer-events-none absolute inset-[12%] rounded-full border border-white/[0.04] bg-gradient-to-b from-white/[0.025] to-transparent" />

      <img
        src={preset}
        alt=""
        draggable="false"
        className="relative z-10 h-full w-full select-none object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,.38)]"
      />

      {headwear && (
        <EquipmentBadge
          asset={getItemAsset(headwear)}
          accent={headwear.color}
          position="left"
          label={headwear.label}
        />
      )}

      {face && (
        <EquipmentBadge
          asset={getItemAsset(face)}
          accent={face.color}
          position="right"
          label={face.label}
        />
      )}

      <div className="pointer-events-none absolute bottom-[6%] left-1/2 z-20 h-[3px] w-[58%] -translate-x-1/2 rounded-full bg-white/10 blur-[1px]" />
    </div>
  );
}

function EquipmentBadge({ asset, accent = "#52E3FF", position, label }) {
  const side = position === "left" ? "left-[-6%]" : "right-[-6%]";
  return (
    <div
      className={`absolute top-[19%] z-30 ${side} flex h-[30%] w-[30%] items-center justify-center rounded-2xl border backdrop-blur-md`}
      style={{
        background: "rgba(7,11,29,.68)",
        borderColor: `${accent}45`,
        boxShadow: `0 12px 28px rgba(0,0,0,.28), 0 0 20px ${accent}15`,
      }}
      title={label}
    >
      <img src={asset} alt="" className="h-[86%] w-[86%] object-contain" />
    </div>
  );
}
