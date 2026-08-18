// Bilgin Ustasi V4.6 — single neutral master / fixed anchor map
// All worn assets render in this 320x427 coordinate system.

export const HERO_VIEWBOX = Object.freeze({ width: 320, height: 427 });

export const HERO_ANCHORS = Object.freeze({
  headTop: { x: 160, y: 42, rotate: 0, scale: 1 },
  forehead: { x: 160, y: 64, rotate: 0, scale: 1 },
  leftEye: { x: 145, y: 82, rotate: -2, scale: 1 },
  rightEye: { x: 176, y: 82, rotate: 2, scale: 1 },
  faceCenter: { x: 160, y: 87, rotate: 0, scale: 1 },
  neck: { x: 160, y: 105, rotate: 0, scale: 1 },
  chest: { x: 160, y: 126, rotate: 0, scale: 1 },
  torso: { x: 160, y: 139, rotate: 0, scale: 1 },
  leftShoulder: { x: 128, y: 112, rotate: -9, scale: 1 },
  rightShoulder: { x: 194, y: 112, rotate: 9, scale: 1 },
  leftHand: { x: 112, y: 184, rotate: -10, scale: 1 },
  rightHand: { x: 222, y: 190, rotate: 11, scale: 1 },
  waist: { x: 160, y: 192, rotate: 0, scale: 1 },
  backCenter: { x: 196, y: 137, rotate: 4, scale: 1 },
  backShoulders: { x: 160, y: 125, rotate: 0, scale: 1 },
  leftAnkle: { x: 126, y: 347, rotate: -4, scale: 1 },
  rightAnkle: { x: 224, y: 365, rotate: 5, scale: 1 },
  leftFoot: { x: 122, y: 390, rotate: -4, scale: 1 },
  rightFoot: { x: 232, y: 406, rotate: 5, scale: 1 },
});

export const HERO_LAYERS = Object.freeze({
  BACK_BEHIND: 10,
  NEUTRAL_BASE: 20,
  OUTFIT: 30,
  SHOES: 35,
  BACK_FRONT: 40,
  CHEST_ACCESSORY: 45,
  HAND_ACCESSORY: 50,
  FACE_ACCESSORY: 55,
  HEADWEAR: 60,
  FX: 70,
});

export function anchorTransform(name, extra = {}) {
  const anchor = HERO_ANCHORS[name] || HERO_ANCHORS.torso;
  const x = anchor.x + Number(extra.x || 0);
  const y = anchor.y + Number(extra.y || 0);
  const rotate = anchor.rotate + Number(extra.rotate || 0);
  const scale = anchor.scale * Number(extra.scale || 1);
  return `translate(${x} ${y}) rotate(${rotate}) scale(${scale})`;
}
