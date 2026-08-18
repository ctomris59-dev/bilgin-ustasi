import heroMaster from "../../assets/avatar-v5/premium/heroMasterData.js";
import { ITEMS } from "../../data/avatarParts";

const byId = Object.fromEntries(ITEMS.map((item) => [item.id, item]));
const themeFor = (avatar, slot) => byId[avatar?.[slot]]?.set || "explorer";

function BackLayer({ theme }) {
  if (theme === "galaxy") return <g opacity=".98"><ellipse cx="160" cy="195" rx="38" ry="52" fill="#261b68" stroke="#69eaff" strokeWidth="4"/><circle cx="160" cy="192" r="18" fill="#7059ff" stroke="#d5f7ff" strokeWidth="3"/><path d="M126 178 88 151 102 205 134 218M194 178 232 151 218 205 186 218" fill="#3a2c9d" stroke="#69eaff" strokeWidth="4"/></g>;
  if (theme === "cloud") return <g opacity=".95" fill="#dff9ff" stroke="#78dfff" strokeWidth="4"><path d="M132 172C96 137 64 157 80 190c8 17 31 26 53 28-14-16-13-31-1-46Z"/><path d="M188 172c36-35 68-15 52 18-8 17-31 26-53 28 14-16 13-31 1-46Z"/></g>;
  if (theme === "forest") return <g transform="rotate(17 214 193)"><rect x="205" y="120" width="24" height="154" rx="12" fill="#7b4d2c" stroke="#e0b56b" strokeWidth="4"/><rect x="210" y="128" width="14" height="135" rx="7" fill="#c18c52"/><circle cx="217" cy="129" r="13" fill="#8a6037" stroke="#e0b56b" strokeWidth="3"/></g>;
  return null;
}

function OutfitLayer({ theme }) {
  if (theme === "galaxy") return <g><path d="M103 151 124 135h72l21 16-12 89-31 13h-28l-31-13Z" fill="#281f70" stroke="#6ae7ff" strokeWidth="4"/><path d="m124 142 36 42 36-42-13 93h-46Z" fill="#4630aa" opacity=".92"/><path d="M111 153 89 171l8 48 21-8 9-56ZM209 153l22 18-8 48-21-8-9-56Z" fill="#312383" stroke="#8167ff" strokeWidth="4"/><path d="M132 183h56" stroke="#8cf4ff" strokeWidth="5"/><circle cx="160" cy="180" r="9" fill="#72efff" stroke="#fff" strokeWidth="2"/><path d="M116 225h88" stroke="#a58dff" strokeWidth="8"/></g>;
  if (theme === "cloud") return <g><path d="M108 150q52-29 104 0l-8 77q-44 22-88 0Z" fill="#eefcff" stroke="#7bcfff" strokeWidth="4"/><path d="M117 150 91 171l7 55 27-9 6-65ZM203 150l26 21-7 55-27-9-6-65Z" fill="#d8f5ff" stroke="#7bcfff" strokeWidth="4"/><path d="M126 217q34 17 68 0l28 76q-62 35-124 0Z" fill="#ccefff" stroke="#8faeff" strokeWidth="4"/><path d="M143 145q17 28 34 0" fill="none" stroke="#fff" strokeWidth="7"/><circle cx="160" cy="229" r="7" fill="#ffd86a"/></g>;
  if (theme === "forest") return <g><path d="M107 149q53-24 106 0l-7 92-31 17h-30l-31-17Z" fill="#176a4f" stroke="#e4bd63" strokeWidth="4"/><path d="M121 148 160 194l39-46-18 99h-42Z" fill="#0d4d3c"/><path d="M114 152 90 174l9 54 25-10 8-64ZM206 152l24 22-9 54-25-10-8-64Z" fill="#1d7b5a" stroke="#d5a94e" strokeWidth="4"/><path d="M131 239 111 313l49-25 49 25-20-74Z" fill="#145d46" stroke="#e4bd63" strokeWidth="4"/><path d="M129 207h62" stroke="#d9b35a" strokeWidth="6"/></g>;
  return null;
}

function ShoesLayer({ theme }) {
  if (theme === "galaxy") return <g fill="#282068" stroke="#66e9ff" strokeWidth="4"><path d="M95 385h42l4 63-55 2 5-50Z"/><path d="M183 385h42l9 65-55-2 4-63Z"/><path d="M98 410h38M184 410h38" stroke="#8a72ff" strokeWidth="6"/></g>;
  if (theme === "cloud") return <g fill="#eefcff" stroke="#7dcfff" strokeWidth="4"><path d="M92 389h48l2 60-59 2 8-43Z"/><path d="M180 389h48l9 62-59-2 2-60Z"/><path d="M86 405q24-20 52 0M182 405q24-20 48 0" stroke="#b6eaff" strokeWidth="10"/></g>;
  if (theme === "forest") return <g fill="#165f47" stroke="#d4a852" strokeWidth="4"><path d="M92 388h48l1 62-59 1 8-45Z"/><path d="M180 388h48l9 63-59-1 2-62Z"/><path d="M99 399 132 430M188 399l32 31" stroke="#61d493" strokeWidth="5"/></g>;
  return null;
}

function HeadLayer({ theme }) {
  if (theme === "galaxy") return <g><ellipse cx="137" cy="73" rx="23" ry="13" fill="#23205f" stroke="#66eaff" strokeWidth="5"/><ellipse cx="183" cy="73" rx="23" ry="13" fill="#23205f" stroke="#66eaff" strokeWidth="5"/><path d="M158 73h5M114 72l-18-7M206 72l18-7" stroke="#8d72ff" strokeWidth="5"/><circle cx="137" cy="73" r="4" fill="#fff"/><circle cx="183" cy="73" r="4" fill="#fff"/></g>;
  if (theme === "cloud") return <g fill="#f5fdff" stroke="#78d9ff" strokeWidth="4"><path d="M125 58 143 69l17-26 17 26 18-11-5 30h-60Z"/><circle cx="160" cy="51" r="7" fill="#ffd86a" stroke="#fff"/></g>;
  if (theme === "forest") return <g><path d="M105 68q55-46 110 0l-7 18H112Z" fill="#6f5432" stroke="#d9b064" strokeWidth="4"/><path d="M93 83q67-15 134 0" stroke="#5c452e" strokeWidth="13" strokeLinecap="round"/><path d="M164 53q18 8 26 23" stroke="#3fc987" strokeWidth="5"/></g>;
  return null;
}

function AccessoryLayer({ theme }) {
  if (theme === "galaxy") return <g><circle cx="160" cy="176" r="15" fill="#5b44dd" stroke="#79ecff" strokeWidth="4"/><path d="m160 164 8 12-8 12-8-12Z" fill="#d6faff"/></g>;
  if (theme === "cloud") return <g><circle cx="160" cy="178" r="14" fill="#8bdfff" stroke="#fff" strokeWidth="4"/><path d="m160 168 4 7 8 1-6 5 2 8-8-4-8 4 2-8-6-5 8-1Z" fill="#ffd96c"/></g>;
  if (theme === "forest") return <g><path d="M187 183q18-20 30 0-14 18-30 0Z" fill="#42c77f" stroke="#e0ba61" strokeWidth="3"/><path d="M202 173v20" stroke="#f1d786" strokeWidth="3"/></g>;
  return null;
}

export default function WardrobeAvatar({ avatar = {}, className = "", compact = false }) {
  const outfit = themeFor(avatar, "outfit");
  const shoes = themeFor(avatar, "shoes");
  const head = themeFor(avatar, "headwear");
  const accessory = themeFor(avatar, "face");
  const back = themeFor(avatar, "back");
  return <div className={`v48-avatar ${compact ? "is-compact" : ""} ${className}`}>
    <svg className="v48-layer v48-layer-back" viewBox="0 0 320 480" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><BackLayer theme={back}/></svg>
    <img className="v48-master" src={heroMaster} alt="Bilgin Kaşif"/>
    <svg className="v48-layer v48-layer-front" viewBox="0 0 320 480" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <OutfitLayer theme={outfit}/><ShoesLayer theme={shoes}/><AccessoryLayer theme={accessory}/><HeadLayer theme={head}/>
    </svg>
  </div>;
}
