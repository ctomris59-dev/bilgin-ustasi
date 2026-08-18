import explorerFull from "./explorerFull.js";
import cloudFull from "./cloudFull.js";
import forestFull from "./forestFull.js";

export const V49_SET_VISUALS = Object.freeze({
  explorer: Object.freeze({ full: explorerFull }),
  cloud: Object.freeze({ full: cloudFull }),
  forest: Object.freeze({ full: forestFull }),
});
export function getV49SetVisual(setId="explorer"){return V49_SET_VISUALS[setId]||V49_SET_VISUALS.explorer;}
export function getV49ItemVisual(item={}){return getV49SetVisual(item.set)?.full||V49_SET_VISUALS.explorer.full;}
