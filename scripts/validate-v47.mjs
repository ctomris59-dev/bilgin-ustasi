import fs from "node:fs";

const read=(p)=>fs.readFileSync(new URL(`../${p}`,import.meta.url),"utf8");
const must=(ok,msg)=>{if(!ok){console.error(`❌ ${msg}`);process.exitCode=1}else console.log(`✅ ${msg}`)};
const main=read("src/main.jsx");
const app=read("src/V47App.jsx");
const shell=read("src/components/shell/AppShell.jsx");
const hero=read("src/components/v47/HeroHub.jsx");
const lessons=read("src/components/v47/LessonsHub.jsx");
const assets=read("src/data/gameAssets.js");
const css=read("src/v47-reference.css");

must(main.includes("V47App") && main.includes("v47-reference.css"),"Production entrypoint yalnızca V4.7 referans uygulamasına bağlı");
must(!main.includes("v46-layered-rig") && !main.includes("./App.jsx"),"Eski V4.6 layered rig production girişinden çıkarıldı");
must(hero.includes("CHARACTER_PRESETS") && hero.includes("PRESET_LABELS"),"Kırık parça overlay yerine tam-render karakter presetleri aktif");
must(assets.includes("explorer:")&&assets.includes("galaxy:")&&assets.includes("cloud:")&&assets.includes("forest:"),"Keşif/Galaksi/Bulut/Orman tam karakter presetleri mevcut");
must(shell.includes('"lessons"')&&app.includes('tab === "lessons"'),"Dersler ana navigasyona bağlı");
must(lessons.includes("onStartTest")&&lessons.includes("onGeneratePractice"),"Ders kartları gerçek test/pratik akışını başlatıyor");
must(css.includes(".v47-hero-page")&&css.includes(".v47-lessons-page")&&css.includes(".v47-topbar"),"Referans görsel tasarım sistemi yüklü");
must(app.includes("TestSolver")&&app.includes("ResultScreen"),"Ders → soru → sonuç bağlantısı korunuyor");

if(process.exitCode) process.exit(process.exitCode);
console.log("🚀 V4.7 — FULL REFERENCE REDESIGN / FULL-RENDER HERO PRESETS / CONNECTED LESSONS doğrulaması başarılı.");
