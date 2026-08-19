import explorerFull from "../v492q25/explorer.js";
import cloudVisible from "../game-assets/avatar/presets/explorer-pink.png";
import forestVisible from "../game-assets/avatar/presets/explorer-casual.png";

// V4.9.5 visible-set registry.
// Explorer keeps the HD master. Cloud/Forest temporarily use proven visible PNG renders
// because their generated AVIF masters decode successfully but contain no visible pixels.
export const V49_SET_VISUALS = Object.freeze({
  explorer: Object.freeze({ full: explorerFull, width:1086, height:1448, format:"avif", visible:true }),
  cloud: Object.freeze({ full: cloudVisible, format:"png", visible:true }),
  forest: Object.freeze({ full: forestVisible, format:"png", visible:true }),
});

export function getV49SetVisual(setId="explorer") {
  return V49_SET_VISUALS[setId] || V49_SET_VISUALS.explorer;
}

export function getV49ItemVisual(item={}) {
  return getV49SetVisual(item.set)?.full || V49_SET_VISUALS.explorer.full;
}
