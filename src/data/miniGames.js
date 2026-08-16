export const MEMORY_THEMES = [
  { id: "meyveler", label: "Doğa Kodları", emojis: ["🍓", "🍌", "🍇", "🍒", "🍑", "🍉"] },
  { id: "sevimli", label: "Keşif Dostları", emojis: ["🦊", "🐱", "🐰", "🐼", "🦉", "🐨"] },
  { id: "tatlilar", label: "Enerji Molası", emojis: ["🧁", "🍩", "🍦", "🍭", "🍰", "🍫"] },
  { id: "deniz", label: "Derin Deniz", emojis: ["🐬", "🐙", "🐠", "🐚", "🦀", "🪼"] },
  { id: "uzay", label: "Yıldız İstasyonu", emojis: ["🚀", "🪐", "🌟", "🛸", "🌙", "☄️"] },
];
export function shuffle(array){const arr=[...array];for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
export function buildDeck(theme){return shuffle(theme.emojis.flatMap((emoji,i)=>[{id:`${i}-a`,pairId:i,emoji},{id:`${i}-b`,pairId:i,emoji}]));}
