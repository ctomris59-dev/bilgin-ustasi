import { useEffect, useMemo, useRef, useState } from "react";
import heroMaster from "../../assets/avatar-v5/premium/heroMasterData.js";
import { getRigLoadout, getRigSignature, HERO_PROFILE } from "../../data/avatarRig";
import { getItemCardAsset, getWearableAsset } from "../../data/gameAssets";

const VIEW_W = 320;
const VIEW_H = 427;
const EQUIPMENT_ORDER = ["back", "outfit", "shoes", "headwear", "face"];

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

function motionFrame(motion, elapsed) {
  const t = elapsed / 1000;

  if (motion === "thinking") {
    return {
      x: 5 + Math.sin(t * 2.6) * 2.2,
      y: -5 + Math.sin(t * 3.1) * 1.8,
      rotate: 2.8 + Math.sin(t * 2.2) * 1.1,
      scale: 1.008,
    };
  }

  if (motion === "happy") {
    const bounce = Math.abs(Math.sin(t * 5.2));
    return {
      x: Math.sin(t * 3.8) * 2.2,
      y: -4 - bounce * 13,
      rotate: Math.sin(t * 4.6) * 1.25,
      scale: 1 + bounce * 0.018,
    };
  }

  if (motion === "victory") {
    const phase = (t % 1.25) / 1.25;
    const jumpPhase = Math.min(phase / 0.72, 1);
    const jump = phase < 0.72 ? Math.sin(Math.PI * jumpPhase) : 0;
    return {
      x: Math.sin(t * 5.1) * 3.2,
      y: -jump * 27,
      rotate: Math.sin(t * 4.9) * 2.1,
      scale: 1 + jump * 0.026,
    };
  }

  if (motion === "levelup") {
    const pulse = (Math.sin(t * 4.4) + 1) / 2;
    return { x: 0, y: -pulse * 12, rotate: 0, scale: 1 + pulse * 0.027 };
  }

  if (motion === "equip") {
    const p = Math.min(elapsed / 720, 1);
    const overshoot = p < 0.58 ? p / 0.58 : 1 - ((p - 0.58) / 0.42);
    return {
      x: 0,
      y: -Math.sin(Math.PI * p) * 7,
      rotate: 0,
      scale: 0.94 + p * 0.06 + Math.max(0, overshoot) * 0.055,
    };
  }

  const breathe = (Math.sin(t * 2.05) + 1) / 2;
  return {
    x: Math.sin(t * 1.25) * 1.6,
    y: -2 - breathe * 6,
    rotate: Math.sin(t * 1.35) * 0.55,
    scale: 1 + breathe * 0.007,
  };
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
  const stackRef = useRef(null);
  const [equipBurst, setEquipBurst] = useState(false);

  useEffect(() => {
    if (previousSignature.current === signature) return;
    previousSignature.current = signature;
    setEquipBurst(true);
    const timer = window.setTimeout(() => setEquipBurst(false), 760);
    return () => window.clearTimeout(timer);
  }, [signature]);

  const motion = equipBurst ? "equip" : animation;

  useEffect(() => {
    const node = stackRef.current;
    if (!node) return undefined;

    let frameId = 0;
    let stopped = false;
    const startedAt = performance.now();

    const tick = (now) => {
      if (stopped || !stackRef.current) return;
      const frame = motionFrame(motion, now - startedAt);
      stackRef.current.style.transform = `translate3d(${frame.x.toFixed(2)}px, ${frame.y.toFixed(2)}px, 0) rotate(${frame.rotate.toFixed(2)}deg) scale(${frame.scale.toFixed(4)})`;
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => {
      stopped = true;
      window.cancelAnimationFrame(frameId);
      if (node) node.style.transform = "translate3d(0,0,0) rotate(0deg) scale(1)";
    };
  }, [motion]);

  const equipped = EQUIPMENT_ORDER.map((slot) => loadout[slot]).filter(Boolean);
  const backLayers = equipped.filter((item) => visualSlot(item) === "back");
  const frontLayers = equipped.filter((item) => visualSlot(item) !== "back");

  return (
    <div
      className={`v5-animated-avatar v5p-avatar v45-live-avatar motion-${motion} ${compact ? "is-compact" : ""}`}
      style={{ width: size, aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
      role="img"
      aria-label={`${HERO_PROFILE.name}, kıvırcık saçlı yeşil gözlü Bilgin Kaşif`}
      data-avatar-version="4.5.3-master-fixed"
      data-rig-signature={signature}
      data-motion={motion}
      data-outfit={loadout.outfit?.id || "base"}
    >
      <div className="v5p-aura" aria-hidden="true" />
      <div className="v5p-floor" aria-hidden="true" />
      {equipBurst && <div className="v5p-equip-ring" aria-hidden="true" />}

      <div ref={stackRef} className="v45-live-stack" aria-hidden="true">
        {showEquipment && backLayers.map((item) => (
          <WearableLayer key={`back-${item.id}-${signature}`} item={item} />
        ))}

        <img src={heroMaster} alt="" draggable="false" className="v45-live-master" />

        {showEquipment && frontLayers.map((item) => (
          <WearableLayer key={`${item.slot}-${item.id}-${signature}`} item={item} />
        ))}
      </div>

      <MotionFX motion={motion} />

      {showBadges && (
        <div className="v5p-status"><span>{motion.toUpperCase()}</span><b>{equipped.length}/5</b></div>
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
      {motion === "equip" && <span className="v45-fx-equip">KUŞANILDI!</span>}
    </div>
  );
}
