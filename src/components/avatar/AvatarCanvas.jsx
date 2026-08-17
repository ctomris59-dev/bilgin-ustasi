import { ITEMS } from "../../data/avatarParts";
import { getCharacterStyleAsset } from "../../data/gameAssets";

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

function resolveRigStyle(avatar = {}) {
  const explicit = avatar.characterStyle;
  if (explicit && explicit !== "auto") return explicit;

  const outfit = ITEMS.find((item) => item.id === avatar.outfit);
  return STYLE_BY_SET[outfit?.set] || "blue";
}

export default function AvatarCanvas({
  avatar = {},
  size = 180,
  showEquipment = true,
  showBadges = false,
}) {
  const style = resolveRigStyle(avatar);
  const preset = getCharacterStyleAsset(style);
  const equippedCount = [avatar.outfit, avatar.shoes, avatar.headwear, avatar.face, avatar.back].filter(Boolean).length;

  return (
    <div
      className="game-avatar v44-avatar-rig"
      style={{ width: size, height: size * 1.25 }}
      role="img"
      aria-label="Kaşif avatarı"
      data-rig-style={style}
    >
      <div className="v44-avatar-aura" />
      <img src={preset} alt="" draggable="false" className="v44-avatar-character" />
      <div className="v44-avatar-floor" />

      {showEquipment && equippedCount > 0 && (
        <div className="v44-rig-status" aria-hidden="true">
          <span>✦</span>
          <b>{equippedCount}</b>
        </div>
      )}

      {showBadges && <span className="v44-rig-label">RIG SAFE</span>}
    </div>
  );
}
