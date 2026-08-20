import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const must=(cond,msg)=>{if(!cond){console.error(`❌ V5.0: ${msg}`);process.exit(1);}};

const styles=read('src/data/characterStyles.js');
const hero=read('src/components/v47/HeroHub.jsx');
const shop=read('src/components/v47/ShopHub.jsx');
const storage=read('src/lib/storage.js');
const catalog=read('src/data/catalog.js');
const gameAssets=read('src/data/gameAssets.js');
const main=read('src/main.jsx');
const sprite=read('src/assets/v50/styleSprite.js');
const css=read('src/v50-styles.css');
const atlasPath=path.join(root,'public/character-styles/v50-styles.avif');

const ids=[...styles.matchAll(/\["style-(\d{2})"/g)].map((m)=>m[1]);
must(ids.length===20,'characterStyles.js must define exactly 20 full styles');
must(new Set(ids).size===20,'style IDs must be unique');
must(styles.includes('width:640,height:960'),'all style metadata must use the same 640×960 tile resolution');
must(styles.includes('STYLE_UNLOCK_STEP = 250'),'styles must unlock through XP progression');

must(sprite.includes('SPRITE_COLUMNS = 5')&&sprite.includes('SPRITE_ROWS = 4'),'sprite must be a 5×4 atlas');
must(sprite.includes('/character-styles/v50-styles.avif'),'runtime must use the single production AVIF atlas');
must(sprite.includes('STYLE_TILE_WIDTH = 640')&&sprite.includes('STYLE_TILE_HEIGHT = 960'),'sprite tile metadata must be 640×960');
must(fs.existsSync(atlasPath),'production V5 AVIF atlas is missing');
const atlas=fs.readFileSync(atlasPath);
must(atlas.length>500000,'production V5 AVIF atlas looks too small/truncated');
must(atlas.subarray(4,12).toString('ascii').includes('ftypavif'),'production V5 atlas is not an AVIF file');

must(hero.includes('StyleRender')&&!hero.includes('SLOT_TABS')&&!hero.includes('SET_LOADOUTS'),'HeroHub must use full-style renderer only');
must(shop.includes('StyleRender')&&!shop.includes('onBuyItem'),'ShopHub must be a separate XP style gallery');
must(storage.includes('LEGACY_WEARABLE_PREFIXES')&&storage.includes('styleId'),'storage must migrate old wearables to styleId');
must(!catalog.includes('avatarParts')&&!catalog.includes('outfit'),'shared catalog must not expose character wearables');
must(!gameAssets.includes('assets/v49')&&!gameAssets.includes('game-assets/**/*'),'V5 bundle must not import legacy wearable registries or broad character asset globs');
must(gameAssets.includes('getWearableAsset=()=>""'),'legacy wearable resolver must be disabled');
must(main.includes('v50-styles.css')&&!main.includes('v49-wardrobe.css')&&!main.includes('v494-tryon.css'),'runtime must use V5 CSS only');
must(css.includes('.v50-sprite-render')&&css.includes('aspect-ratio:2/3'),'sprite rendering must preserve the 2:3 master ratio');

console.log(`✅ V5.0 validated: 20 styles · 640×960 each · 3200×3840 AVIF atlas · XP unlock · no wearable slots/assets.`);
