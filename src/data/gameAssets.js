import { getV49ItemVisual, getV49SetVisual } from "../assets/v49/index.js";
/* Bilgin Ustası V4.9 asset registry. */
const ASSET_MODULES = import.meta.glob("../assets/game-assets/**/*.{png,jpg,jpeg,webp}", { eager: true, query: "?url", import: "default" });
function asset(relativePath){ const key=`../assets/game-assets/${relativePath}`; return ASSET_MODULES[key] || ""; }
const HAIR_ASSETS={"hair-space-buns":asset("avatar/hair/hair-1.png"),"hair-long-braid":asset("avatar/hair/hair-2.png"),"hair-twin-pigtails":asset("avatar/hair/hair-3.png"),"hair-bob-bangs":asset("avatar/hair/hair-4.png"),"hair-wavy-long":asset("avatar/hair/hair-5.png"),"hair-curly-afro":asset("avatar/hair/hair-6.png")};
export const CHARACTER_PRESETS=Object.freeze({explorer:asset("avatar/presets/explorer-street.png"),galaxy:asset("avatar/presets/explorer-red.png"),cloud:asset("avatar/presets/explorer-pink.png"),forest:asset("avatar/presets/explorer-casual.png"),blue:asset("avatar/presets/explorer-blue.png")});
export const CHARACTER_STYLES=[{id:"master",label:"Bilgin Kaşif",description:"Tek sabit Bilgin Kaşif karakteri.",asset:CHARACTER_PRESETS.explorer}];
export const GAME_ASSETS={logo:asset("logo.jpg"),roomBackground:asset("rooms/base-study-room.jpg"),mapBackground:asset("worlds/map-background.jpg"),heroStage:asset("scenes/hero-character-stage.webp"),premiumBaseRoom:asset("scenes/premium-base-room.webp")};
function normalizeSlot(slot){const aliases={petSpecies:"petSpecies",petAccessory:"petAccessory",outfit:"outfit",shoes:"shoes",headwear:"headwear",face:"face",back:"back",wallpaper:"wallpaper",rug:"rug",desk:"desk",lamp:"lamp",plant:"plant",poster:"poster"};return aliases[slot]||slot;}
function resolveArtIdentity(itemOrId,slotOverride){const item=typeof itemOrId==="string"?{id:itemOrId,slot:slotOverride}:itemOrId||{};return{item,id:item.assetId||item.id,slot:normalizeSlot(item.assetSlot||item.slot||slotOverride)};}
export function getItemAsset(itemOrId,slotOverride){const{id,slot}=resolveArtIdentity(itemOrId,slotOverride);if(!id||!slot)return"";return asset(`premium/${slot}/${id}.webp`)||asset(`unique/${slot}/${id}.png`);}
export function getItemCardAsset(itemOrId,slotOverride){if(typeof itemOrId==="object"&&itemOrId?.wearableVersion===4)return getV49ItemVisual(itemOrId);if(typeof itemOrId==="object"&&itemOrId?.cardAsset)return itemOrId.cardAsset;return getItemAsset(itemOrId,slotOverride);}
export function getCharacterSetAsset(setId="explorer"){return getV49SetVisual(setId)?.full||"";}
export const getWearableAsset=(itemOrId,slotOverride)=>{const{id,slot}=resolveArtIdentity(itemOrId,slotOverride);if(!id||!slot)return"";return asset(`wearables/${slot}/${id}.webp`);};
export function getPetAsset(petId){if(!petId)return"";return asset(`premium/petSpecies/${petId}.webp`)||asset(`unique/petSpecies/${petId}.png`);}
export function getHairAsset(hairId){return HAIR_ASSETS[hairId]||HAIR_ASSETS["hair-curly-afro"]||"";}
export function getCharacterStyleAsset(){return getV49SetVisual("explorer")?.full||CHARACTER_PRESETS.explorer||CHARACTER_PRESETS.blue;}
export function getAvatarPreset(){return getCharacterStyleAsset();}
export function getRarity(item={}){if(item.legendary)return"legendary";const price=Number(item.price||0);const worldNumber=Number(String(item.world||"w1").replace("w",""))||1;if(price>=180||worldNumber>=5)return"epic";if(price>=100||worldNumber>=3)return"rare";return"common";}
export function getRarityMeta(rarity){const table={common:{label:"COMMON",color:"#9EB0C8",frame:asset("ui/rarity/common.png")},rare:{label:"RARE",color:"#52D8FF",frame:asset("ui/rarity/rare.png")},epic:{label:"EPIC",color:"#B46CFF",frame:asset("ui/rarity/epic.png")},legendary:{label:"LEGENDARY",color:"#FFBE3D",frame:asset("ui/rarity/legendary.png")}};return table[rarity]||table.common;}
export function getWorldAsset(worldId){const n=Math.max(1,Math.min(8,Number(String(worldId||"w1").replace("w",""))||1));return asset(`worlds/world-${n}.png`);}
