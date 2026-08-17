import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'src/components/shell/AppShell.jsx',
  'src/components/shell/SideNav.jsx',
  'src/components/shell/TopBar.jsx',
  'src/components/shell/RightRail.jsx',
  'src/components/Shop.jsx',
  'src/components/avatar/Wardrobe.jsx',
  'src/components/avatar/RoomBuilder.jsx',
  'src/components/StickerAlbum.jsx',
  'src/data/catalog.js',
  'src/data/gameAssets.js',
];
let failed = false;
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) { console.error('Eksik:', rel); failed = true; }
}
const premiumRoot = path.join(root, 'src/assets/game-assets/premium');
let premiumCount = 0;
function walk(dir) { if (!fs.existsSync(dir)) return; for (const name of fs.readdirSync(dir)) { const p=path.join(dir,name); const s=fs.statSync(p); if(s.isDirectory()) walk(p); else if(name.endsWith('.webp')) premiumCount += 1; } }
walk(premiumRoot);
console.log(`V4 premium item art: ${premiumCount}/80`);
if (premiumCount !== 80) { console.error('Premium item asset sayısı 80 olmalı.'); failed = true; }
if (failed) process.exit(1);
console.log('V4 dosya kontrolü başarılı.');
