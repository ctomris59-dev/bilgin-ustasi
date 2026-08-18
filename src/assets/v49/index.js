import explorerFull from "./explorerFull.js";
import explorerItems from "./explorerItems.js";
import cloudFull from "./cloudFull.js";
import cloudItems from "./cloudItems.js";
import forestFull from "./forestFull.js";
import forestItems from "./forestItems.js";

export const V49_SET_VISUALS = Object.freeze({
  explorer: Object.freeze({ full: explorerFull, ...explorerItems }),
  cloud: Object.freeze({ full: cloudFull, ...cloudItems }),
  forest: Object.freeze({ full: forestFull, ...forestItems }),
});
export function getV49SetVisual(setId="explorer"){return V49_SET_VISUALS[setId]||V49_SET_VISUALS.explorer;}
export function getV49ItemVisual(item={}){const set=getV49SetVisual(item.set);return set?.[item.slot]||set?.outfit||"";}
