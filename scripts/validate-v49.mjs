import fs from "node:fs";
import explorerHD from "../src/assets/v492q25/explorer.js";
import cloudHD from "../src/assets/v492/cloud.js";
import forestHD from "../src/assets/v492/forest.js";

const read=(p)=>fs.readFileSync(new URL(`../${p}`,import.meta.url),"utf8");
const avatar=read("src/data/avatarParts.js");
const hub=read("src/components/v47/HeroHub.jsx");
const storage=read("src/lib/storage.js");
const main=read("src/main.jsx");
const css=read("src/v49-wardrobe.css");
const registry=read("src/assets/v49/index.js");
const pkg=JSON.parse(read("package.json"));

function inspectAvif(dataUri){
  if(!dataUri?.startsWith("data:image/avif;base64,"))return {ok:false,width:0,height:0,bytes:0};
  const buf=Buffer.from(dataUri.split(",")[1],"base64");
  const ispe=buf.indexOf(Buffer.from("ispe"));
  if(ispe<0||ispe+16>buf.length)return {ok:false,width:0,height:0,bytes:buf.length};
  const width=buf.readUInt32BE(ispe+8);const height=buf.readUInt32BE(ispe+12);
  return {ok:buf.subarray(4,12).toString("ascii").includes("ftyp"),width,height,bytes:buf.length};
}
const hd={explorer:inspectAvif(explorerHD),cloud:inspectAvif(cloudHD),forest:inspectAvif(forestHD)};
const allFullHd=Object.values(hd).every((x)=>x.ok&&x.width===1086&&x.height===1448&&x.bytes>18000);

const checks=[
  [pkg.version==="4.9.2","Sürüm 4.9.2"],
  [(avatar.match(/id:\"(?:outfit|shoes|headwear|face|back)-v49-/g)||[]).length===15,"15 item / 3 set korunuyor"],
  [hub.includes('getCharacterSetAsset')&&hub.includes('v49-set-hero'),"Merkez karakter HD registry kullanıyor"],
  [hub.includes('v49-preview-window')&&hub.includes('ItemPreview'),"Item preview pencereleri korunuyor"],
  [css.includes('overflow:hidden')&&!css.includes('transform:scale(2.6)'),"Layout taşma hacklerinden arındırılmış"],
  [registry.includes('../v492q25/explorer.js')&&registry.includes('../v492/cloud.js')&&registry.includes('../v492/forest.js'),"Runtime yalnızca HD master registry'ye bağlı"],
  [allFullHd,`Üç HD master gerçek 1086×1448 AVIF (${Object.entries(hd).map(([k,v])=>`${k}:${v.width}x${v.height}/${v.bytes}B`).join(', ')})`],
  [!hub.includes('WardrobeAvatar'),"Eski katmanlı WardrobeAvatar kapalı"],
  [main.includes('./v49-wardrobe.css'),"Mevcut V4.7/V4.9 tasarım CSS'i korunuyor"],
  [storage.includes('makeAvatarForSet')&&storage.includes('detectedSet'),"Profil set migrasyonu korunuyor"],
];
let failed=false;for(const [ok,label] of checks){console.log(`${ok?'✅':'❌'} ${label}`);if(!ok)failed=true;}
if(failed)process.exit(1);
console.log('🚀 V4.9.2 — FULL HD CHARACTER ASSET PASS doğrulaması başarılı.');
