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

const ids=[...styles.matchAll(/\["style-(\d{2})"/g)].map((m)=>m[1]);
must(ids.length===20,'characterStyles.js must define exactly 20 full styles');
must(new Set(ids).size===20,'style IDs must be unique');
must(styles.includes('width:1024,height:1536'),'all style metadata must use 1024×1536');
must(styles.includes('STYLE_UNLOCK_STEP = 250'),'styles must unlock through XP progression');

must(sprite.includes('SPRITE_COLUMNS = 5')&&sprite.includes('SPRITE_ROWS = 4'),'sprite must be a 5×4 atlas');
for(let i=0;i<4;i++)must(fs.existsSync(path.join(root,`src/assets/v50/sprite${i}.js`)),`sprite${i}.js missing`);
const payload=[0,1,2,3].map((i)=>{
  const src=read(`src/assets/v50/sprite${i}.js`);
  const m=src.match(/export default '([\s\S]*)';\s*$/);
  must(Boolean(m),`sprite${i}.js is malformed`);
  return m[1];
}).join('');
must(payload.startsWith('AAAAIGZ0eXBhdmlm'),'sprite payload is not AVIF');
must(payload.length>90000,'sprite payload looks truncated');

must(hero.includes('StyleRender')&&!hero.includes('SLOT_TABS')&&!hero.includes('SET_LOADOUTS'),'HeroHub must use full-style renderer only');
must(shop.includes('StyleRender')&&!shop.includes('onBuyItem'),'ShopHub must be a separate XP style gallery');
must(storage.includes('LEGACY_WEARABLE_PREFIXES')&&storage.includes('styleId'),'storage must migrate old wearables to styleId');
must(!catalog.includes('avatarParts')&&!catalog.includes('outfit'),'shared catalog must not expose character wearables');
must(!gameAssets.includes('assets/v49')&&!gameAssets.includes('game-assets/**/*'),'V5 bundle must not import legacy wearable registries or broad character asset globs');
must(gameAssets.includes('getWearableAsset=()=>""'),'legacy wearable resolver must be disabled');
must(main.includes('v50-styles.css')&&!main.includes('v49-wardrobe.css')&&!main.includes('v494-tryon.css'),'runtime must use V5 CSS only');
must(css.includes('.v50-sprite-render')&&css.includes('aspect-ratio:2/3'),'sprite rendering must preserve the 2:3 master ratio');

console.log(`✅ V5.0 validated: 20 styles · 1024×1536 · 5×4 AVIF sprite · no wearable slots/assets.`);
