import { ITEMS } from "../../data/avatarParts";
import { getAvatarPreset, getItemCardAsset } from "../../data/gameAssets";

// V4.3.2: Build-safe wearable registry.
// Wearable assets are loaded locally so AvatarCanvas does not depend on a
// getWearableAsset named export from gameAssets.js. This makes the component
// compatible with both older and newer gameAssets registries.
const WEARABLE_MODULES = import.meta.glob(
  "../../assets/game-assets/wearables/**/*.webp",
  { eager: true, query: "?url", import: "default" }
);

const SLOT_ORDER = ["back", "outfit", "shoes", "headwear", "face"];

function getWearableAsset(item) {
  if (!item?.id || !item?.slot) return "";
  const key = `../../assets/game-assets/wearables/${item.slot}/${item.id}.webp`;
  return WEARABLE_MODULES[key] || "";
}

export default function AvatarCanvas({
  avatar = {},
  size = 180,
  showEquipment = true,
  showBadges = false,
}) {
  const preset = getAvatarPreset(avatar);

  const equipped = SLOT_ORDER
    .map((slot) => ({
      slot,
      id: avatar?.[slot],
      item: ITEMS.find((row) => row.id === avatar?.[slot]),
    }))
    .filter((row) => row.item);

  return (
    <div
      className="game-avatar v43-avatar relative isolate flex items-end justify-center"
      style={{ width: size, height: size * 1.25 }}
      role="img"
      aria-label="Kaşif avatarı"
    >
      <div className="v43-avatar-aura" />

      {showEquipment &&
        equipped
          .filter((row) => row.slot === "back")
          .map((row) => (
            <Wearable key={row.slot} row={row} className="is-back" />
          ))}

      <img src={preset} alt="" draggable="false" className="v43-avatar-base" />

      {showEquipment &&
        equipped
          .filter((row) => row.slot !== "back")
          .map((row) => (
            <Wearable
              key={row.slot}
              row={row}
              className={`is-${row.slot}`}
            />
          ))}

      {showBadges &&
        equipped.map((row, index) => (
          <div
            className={`v43-avatar-mini-slot slot-${index}`}
            key={`badge-${row.slot}`}
            title={row.item.label}
          >
            <img src={getItemCardAsset(row.item)} alt="" />
          </div>
        ))}

      <div className="v43-avatar-floor" />
    </div>
  );
}

function Wearable({ row, className }) {
  const src = getWearableAsset(row.item);
  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      draggable="false"
      className={`v43-wearable ${className}`}
    />
  );
}
