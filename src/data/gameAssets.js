/* V5.0 asset registry — character wearables are intentionally excluded. */
const ASSET_MODULES = import.meta.glob([
  "../assets/game-assets/logo.jpg",
  "../assets/game-assets/rooms/**/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/worlds/**/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/scenes/**/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/ui/rarity/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/premium/petSpecies/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/unique/petSpecies/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/premium/petAccessory/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/unique/petAccessory/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/premium/wallpaper/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/unique/wallpaper/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/premium/rug/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/unique/rug/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/premium/desk/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/unique/desk/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/premium/lamp/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/unique/lamp/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/premium/plant/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/unique/plant/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/premium/poster/*.{png,jpg,jpeg,webp}",
  "../assets/game-assets/unique/poster/*.{png,jpg,jpeg,webp}"
], { eager: true, query: "?url", import: "default" });

function asset(relativePath){const key=`../assets/game-assets/${relativePath}`;return ASSET_MODULES[key]||"";}

export const CHARACTER_PRESETS=Object.freeze({});
export const CHARACTER_STYLES=[];
export const GAME_ASSETS={
  logo:asset("logo.jpg"),
  roomBackground:asset("rooms/base-study-room.jpg"),
  mapBackground:asset("worlds/map-background.jpg"),
  heroStage:asset("scenes/hero-character-stage.webp"),
  premiumBaseRoom:asset("scenes/premium-base-room.webp")
};

function normalizeSlot(slot){return slot||"";}
function resolveArtIdentity(itemOrId,slotOverride){const item=typeof itemOrId==="string"?{id:itemOrId,slot:slotOverride}:itemOrId||{};return{item,id:item.assetId||item.id,slot:normalizeSlot(item.assetSlot||item.slot||slotOverride)};}
export function getItemAsset(itemOrId,slotOverride){const{id,slot}=resolveArtIdentity(itemOrId,slotOverride);if(!id||!slot)return"";return asset(`premium/${slot}/${id}.webp`)||asset(`unique/${slot}/${id}.png`);}
export function getItemCardAsset(itemOrId,slotOverride){if(typeof itemOrId==="object"&&itemOrId?.cardAsset)return itemOrId.cardAsset;return getItemAsset(itemOrId,slotOverride);}
export function getCharacterSetAsset(){return"";}
export const getWearableAsset=()=>"";
export function getPetAsset(petId){if(!petId)return"";return asset(`premium/petSpecies/${petId}.webp`)||asset(`unique/petSpecies/${petId}.png`);}
export function getHairAsset(){return"";}
export function getCharacterStyleAsset(){return"";}
export function getAvatarPreset(){return"";}
export function getRarity(item={}){if(item.legendary)return"legendary";const price=Number(item.price||0);const worldNumber=Number(String(item.world||"w1").replace("w",""))||1;if(price>=180||worldNumber>=5)return"epic";if(price>=100||worldNumber>=3)return"rare";return"common";}
export function getRarityMeta(rarity){const table={common:{label:"COMMON",color:"#9EB0C8",frame:asset("ui/rarity/common.png")},rare:{label:"RARE",color:"#52D8FF",frame:asset("ui/rarity/rare.png")},epic:{label:"EPIC",color:"#B46CFF",frame:asset("ui/rarity/epic.png")},legendary:{label:"LEGENDARY",color:"#FFBE3D",frame:asset("ui/rarity/legendary.png")}};return table[rarity]||table.common;}
export function getWorldAsset(worldId){const n=Math.max(1,Math.min(8,Number(String(worldId||"w1").replace("w",""))||1));return asset(`worlds/world-${n}.png`);}
