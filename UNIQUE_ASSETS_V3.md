# V3 — Unique Assets

This release removes the V2 `hashIndex()` artwork selection mechanism.

## What changed
- 80 inventory entries now have 80 dedicated image files.
- Different item names are no longer assigned the same file via hashing.
- Face items use semantic artwork (glasses, magnifier, wand, visor, backpack badge).
- Headwear uses distinct shapes (cap, bow, crown, wizard hat, flower crown, wings, beanie, party hat, halo, detective hat).
- Pet color/species variants have dedicated assets.
- Room inventory items have dedicated assets.
- All production artwork remains under `src/assets` so Vite bundles it during build.

## Compatibility
Item IDs were not changed, so existing owned-item/profile data remains compatible.
