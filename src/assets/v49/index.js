import explorerFull from "../v492q25/explorer.js";
import cloudFull from "../v492/cloud.js";
import forestFull from "../v492/forest.js";

// V4.9.2 HD asset registry. Existing V4.7 layout stays unchanged.
// The center hero and every wardrobe crop now resolve from full-resolution AVIF masters.
export const V49_SET_VISUALS = Object.freeze({
  explorer: Object.freeze({ full: explorerFull, width:1086, height:1448, format:"avif" }),
  cloud: Object.freeze({ full: cloudFull, width:1086, height:1448, format:"avif" }),
  forest: Object.freeze({ full: forestFull, width:1086, height:1448, format:"avif" }),
});
export function getV49SetVisual(setId="explorer"){return V49_SET_VISUALS[setId]||V49_SET_VISUALS.explorer;}
export function getV49ItemVisual(item={}){return getV49SetVisual(item.set)?.full||V49_SET_VISUALS.explorer.full;}
