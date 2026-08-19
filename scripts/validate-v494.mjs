import fs from 'node:fs';
const read=(p)=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const hero=read('src/components/v47/HeroHub.jsx');
const shop=read('src/components/v47/ShopHub.jsx');
const main=read('src/main.jsx');
const css=read('src/v494-tryon.css');
const checks=[
 [hero.includes('const[previewSet,setPreviewSet]'), 'Try-on preview state exists'],
 [hero.includes('previewItem(item)'), 'Item click previews without auto-buy'],
 [hero.includes('DÜKKANDA AÇ →'), 'Locked item uses explicit shop action'],
 [hero.includes('CHARACTER_PRESETS')&&hero.includes('onError'), 'Hero/card image fallback enabled'],
 [shop.includes('CHARACTER_PRESETS')&&shop.includes('onError'), 'Shop image fallback enabled'],
 [main.includes('./v494-tryon.css'), 'Try-on stylesheet loaded'],
 [css.includes('.v494-tryon-badge')&&css.includes('.is-previewing'), 'Preview visual state styled'],
];
let failed=false;for(const [ok,label] of checks){console.log(`${ok?'✅':'❌'} ${label}`);if(!ok)failed=true;}if(failed)process.exit(1);console.log('🚀 V4.9.4 try-on + resilient asset validation successful.');
