import { useEffect, useMemo, useRef, useState } from "react";
import heroMaster from "../../assets/avatar-v5/premium/heroMasterData.js";
import { getRigLoadout, getRigSignature, HERO_PROFILE } from "../../data/avatarRig";
import { getCharacterStyleAsset, getItemCardAsset, getWearableAsset } from "../../data/gameAssets";

const VIEW_W = 320;
const VIEW_H = 427;
const EQUIPMENT_ORDER = ["back", "outfit", "shoes", "headwear", "face"];

const STYLE_BY_SET = {
  gunluk: "street",
  buyulu: "casual",
  deniz: "pink",
  prens: "red",
  uzay: "blue",
  bilim: "street",
  pijama: "pink",
  kozmik: "blue",
};

function artStyleForOutfit(item) {
  if (!item) return null;
  const id = item.id || "";
  if (/red|christmas|volcano|meteor/i.test(id)) return "red";
  if (/pink|summer|candy/i.test(id)) return "pink";
  if (/green|emerald|forest|mountain|overall/i.test(id)) return "casual";
  if (/lab|science|archive|circuit|street/i.test(id)) return "street";
  if (/blue|cloud|galaxy|crystal|star|comet|infinity|ocean|aurora/i.test(id)) return "blue";
  return STYLE_BY_SET[item.set] || ["street", "blue", "casual", "red", "pink"][item.variant % 5] || "street";
}

function visualSlot(item) {
  if (!item) return "";
  if (item.shape === "wings" || item.shape === "backpack-badge") return "back";
  if (["wand", "magnifier"].includes(item.shape)) return "hand";
  return item.slot;
}

function layerAsset(item) {
  if (!item) return { src: "", fallback: false };
  const wearable = getWearableAsset(item);
  if (wearable) return { src: wearable, fallback: false };
  return { src: getItemCardAsset(item), fallback: true };
}

export default function AnimatedAvatar({
  avatar = {},
  size = 320,
  animation = "idle",
  showEquipment = true,
  showBadges = false,
  compact = false,
}) {
  const loadout = useMemo(
    () => getRigLoadout(avatar),
    [avatar.outfit, avatar.shoes, avatar.headwear, avatar.face, avatar.back]
  );
  const signature = useMemo(
    () => getRigSignature(avatar),
    [avatar.outfit, avatar.shoes, avatar.headwear, avatar.face, avatar.back]
  );
  const previousSignature = useRef(signature);
  const [equipBurst, setEquipBurst] = useState(false);

  useEffect(() => {
    if (previousSignature.current === signature) return;
    previousSignature.current = signature;
    setEquipBurst(true);
    const timer = window.setTimeout(() => setEquipBurst(false), 760);
    return () => window.clearTimeout(timer);
  }, [signature]);

  const motion = equipBurst ? "equip" : animation;
  const outfitStyle = artStyleForOutfit(loadout.outfit);
  const baseArt = outfitStyle ? getCharacterStyleAsset(outfitStyle) : heroMaster;
  const equipped = EQUIPMENT_ORDER.map((slot) => loadout[slot]).filter(Boolean);
  const backLayers = equipped.filter((item) => visualSlot(item) === "back");
  const frontLayers = equipped.filter((item) => visualSlot(item) !== "back");

  return (
    <div
      className={`v5-animated-avatar v5p-avatar v45-live-avatar motion-${motion} ${compact ? "is-compact" : ""}`}
      style={{ width: size, aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
      role="img"
      aria-label={`${HERO_PROFILE.name}, kıvırcık saçlı yeşil gözlü Bilgin Kaşif`}
      data-avatar-version="4.5.2-live-rig"
      data-rig-signature={signature}
      data-motion={motion}
      data-outfit={loadout.outfit?.id || "base"}
    >
      <div className="v5p-aura" aria-hidden="true" />
      <div className="v5p-floor" aria-hidden="true" />
      {equipBurst && <div className="v5p-equip-ring" aria-hidden="true" />}

      <div className="v45-live-stack" aria-hidden="true">
        {showEquipment && backLayers.map((item) => <WearableLayer key={`back-${item.id}`} item={item} />)}
        <img src={baseArt} alt="" draggable="false" className="v45-live-master" />
        {showEquipment && frontLayers.map((item) => <WearableLayer key={`${item.slot}-${item.id}`} item={item} />)}
      </div>

      <MotionFX motion={motion} />

      {showBadges && (
        <div className="v5p-status"><span>MASTER HERO</span><b>{equipped.length}/5</b></div>
      )}
    </div>
  );
}

function WearableLayer({ item }) {
  const { src, fallback } = layerAsset(item);
  if (!src) return null;
  const slot = visualSlot(item);
  const shape = item.shape ? ` shape-${item.shape}` : "";
  return (
    <img
      src={src}
      alt=""
      draggable="false"
      className={`v45-live-wearable is-${slot}${shape} ${fallback ? "is-card-fallback" : "is-native-wearable"}`}
      data-item-id={item.id}
      data-slot={slot}
    />
  );
}

function MotionFX({ motion }) {
  return (
    <div className={`v45-motion-fx is-${motion}`} aria-hidden="true">
      {motion === "thinking" && <span className="v45-fx-question">?</span>}
      {motion === "happy" && <><i className="v45-fx-star s1">✦</i><i className="v45-fx-star s2">✦</i></>}
      {motion === "victory" && <><i className="v45-fx-star s1">★</i><i className="v45-fx-star s2">✦</i><i className="v45-fx-star s3">★</i></>}
      {motion === "equip" && <span className="v45-fx-equip">EQUIP!</span>}
    </div>
  );
}
