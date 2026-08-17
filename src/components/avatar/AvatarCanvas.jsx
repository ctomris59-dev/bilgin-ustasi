import { ITEMS } from "../../data/avatarParts";
import { getCharacterStyleAsset } from "../../data/gameAssets";

const WEARABLE_MODULES = import.meta.glob(
  "../../assets/game-assets/wearables/**/*.webp",
  { eager: true, query: "?url", import: "default" }
);

const STYLE_BY_SET = {
  gunluk: "blue",
  buyulu: "casual",
  deniz: "pink",
  prens: "red",
  uzay: "blue",
  bilim: "street",
  pijama: "pink",
  kozmik: "blue",
};

const EQUIPMENT_SLOTS = ["back", "outfit", "shoes", "headwear", "face"];

function findItem(id) {
  return ITEMS.find((item) => item.id === id) || null;
}

function resolveRigStyle(avatar = {}) {
  const outfit = findItem(avatar.outfit);
  if (outfit) return STYLE_BY_SET[outfit.set] || "blue";

  const explicit = avatar.characterStyle;
  if (explicit && explicit !== "auto") return explicit;
  return "blue";
}

function wearableAsset(item) {
  if (!item?.id || !item?.slot) return "";
  const key = `../../assets/game-assets/wearables/${item.slot}/${item.id}.webp`;
  return WEARABLE_MODULES[key] || "";
}

function visualSlot(item) {
  if (!item) return "";
  if (item.shape === "wings" || item.shape === "backpack-badge") return "back";
  if (["wand", "magnifier"].includes(item.shape)) return "hand";
  return item.slot;
}

export default function AvatarCanvas({
  avatar = {},
  size = 180,
  showEquipment = true,
  showBadges = false,
}) {
  const style = resolveRigStyle(avatar);
  const preset = getCharacterStyleAsset(style);

  const equipped = EQUIPMENT_SLOTS
    .map((slot) => ({ slot, item: findItem(avatar?.[slot]) }))
    .filter((entry) => entry.item);

  const backItems = equipped.filter(({ item }) => visualSlot(item) === "back");
  const frontItems = equipped.filter(({ item }) => visualSlot(item) !== "back");

  return (
    <div
      className="game-avatar v44-avatar-rig v45-avatar-rig"
      style={{ width: size, height: size * 1.25 }}
      role="img"
      aria-label="Kaşif avatarı"
      data-rig-style={style}
    >
      <div className="v44-avatar-aura" />

      <div className="v45-avatar-stack">
        {showEquipment && backItems.map(({ slot, item }) => (
          <Wearable key={`${slot}-${item.id}`} item={item} />
        ))}

        <img src={preset} alt="" draggable="false" className="v44-avatar-character v45-avatar-character" />

        {showEquipment && frontItems.map(({ slot, item }) => (
          <Wearable key={`${slot}-${item.id}`} item={item} />
        ))}
      </div>

      <div className="v44-avatar-floor" />

      {showEquipment && equipped.length > 0 && (
        <div className="v44-rig-status" aria-hidden="true">
          <span>✦</span>
          <b>{equipped.length}</b>
        </div>
      )}

      {showBadges && <span className="v44-rig-label">EQUIPPED</span>}
    </div>
  );
}

function Wearable({ item }) {
  const src = wearableAsset(item);
  if (!src) return null;

  const slot = visualSlot(item);
  const shape = item.shape ? ` shape-${item.shape}` : "";

  return (
    <img
      src={src}
      alt=""
      draggable="false"
      className={`v45-wearable is-${slot}${shape}`}
      data-item-id={item.id}
    />
  );
}
