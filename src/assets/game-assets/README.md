# Bilgin Ustası — Game Assets V3

V3 uses **one dedicated artwork file per inventory item**.

## Important rule
`src/data/gameAssets.js` no longer uses hash-based artwork assignment. Every item id resolves to:

`src/assets/game-assets/unique/<slot>/<item-id>.png`

Example:
- `face-glasses` → `unique/face/face-glasses.png`
- `face-glasses-red` → `unique/face/face-glasses-red.png`
- `face-magnifier` → `unique/face/face-magnifier.png`
- `pet-dog-brown` → `unique/petSpecies/pet-dog-brown.png`
- `pet-dog-white` → `unique/petSpecies/pet-dog-white.png`

No two inventory records intentionally share the same file.

## Folders
- `avatar/` — character presets and hair previews
- `unique/outfit/` — 18 unique outfit assets
- `unique/shoes/` — 6 unique shoe assets
- `unique/headwear/` — 19 unique headwear assets
- `unique/face/` — 7 unique accessory assets
- `unique/petSpecies/` — 8 unique pet assets
- `unique/petAccessory/` — 4 unique pet accessories
- `unique/wallpaper/` — 5 unique wallpapers
- `unique/rug/` — 4 unique rugs
- `unique/desk/` — 3 unique desks
- `unique/lamp/` — 2 unique lamps
- `unique/plant/` — 2 unique plants
- `unique/poster/` — 2 unique posters
- `worlds/` — world/map artwork
- `ui/rarity/` — rarity frames

## Adding a new inventory item
1. Add the item to its data file (`avatarParts.js` or `petsAndRoom.js`).
2. Create a PNG named exactly `<item-id>.png`.
3. Put it in the matching `unique/<slot>/` folder.
4. No React component changes are required.
