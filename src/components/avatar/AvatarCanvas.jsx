import { ITEMS } from "../../data/avatarParts";
import { getCharacterStyleAsset, getItemCardAsset } from "../../data/gameAssets";

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

const STYLE_BY_OUTFIT = {
  "outfit-tshirt": "blue",
  "outfit-tshirt-red": "red",
  "outfit-tshirt-yellow": "casual",
  "outfit-tshirt-green": "street",
  "outfit-overalls": "casual",
  "outfit-robe": "casual",
  "outfit-robe-purple": "pink",
  "outfit-robe-emerald": "street",
  "outfit-labcoat": "street",
  "outfit-labcoat-blue": "blue",
  "outfit-halloween": "street",
  "outfit-christmas": "pink",
  "outfit-summer-dress": "pink",
  "outfit-cloud-dress": "blue",
  "outfit-crystal-robe": "red",
  "outfit-galaxy-dress": "blue",
};

const EQUIPMENT_SLOTS = ["outfit", "shoes", "headwear", "face", "back"];

function findItem(id) {
  return ITEMS.find((item) => item.id === id) || null;
}

function resolveRigStyle(avatar = {}) {
  const outfit = findItem(avatar.outfit);
  if (outfit) return STYLE_BY_OUTFIT[outfit.id] || STYLE_BY_SET[outfit.set] || "blue";

  const explicit = avatar.characterStyle;
  if (explicit && explicit !== "auto") return explicit;
  return "blue";
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

  const gearSize = Math.max(24, Math.min(38, Number(size || 180) * 0.12));

  return (
    <div
      className="game-avatar v44-avatar-rig v46-avatar-rig"
      style={{ width: size, height: size * 1.25, "--v46-gear-size": `${gearSize}px` }}
      role="img"
      aria-label="Kaşif avatarı"
      data-rig-style={style}
    >
      <div className="v44-avatar-aura" />
      <img src={preset} alt="" draggable="false" className="v46-avatar-character" />
      <div className="v44-avatar-floor" />

      {showEquipment && equipped.length > 0 && (
        <div className="v46-gear-dock" aria-label="Takılı ekipmanlar">
          {equipped.map(({ slot, item }) => (
            <span key={`${slot}-${item.id}`} className={`v46-gear-chip is-${slot}`} title={`${item.label} · Takılı`}>
              <img src={getItemCardAsset(item)} alt="" draggable="false" />
              <i>✓</i>
            </span>
          ))}
        </div>
      )}

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
