// Tüm ses efektleri Web Audio API ile anlık üretilir - harici ses dosyası
// gerektirmez, bu yüzden internet bağlantısı olmadan da çalışır.

const MUTE_KEY = "bilginustasi_sound_muted";
let ctx = null;

function getCtx() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function isSoundMuted() {
  return localStorage.getItem(MUTE_KEY) === "1";
}

export function toggleSoundMuted() {
  const next = !isSoundMuted();
  localStorage.setItem(MUTE_KEY, next ? "1" : "0");
  return next;
}

function tone(audioCtx, { freq, start, duration, type = "sine", gain = 0.14, freqEnd }) {
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, start + duration);
  gainNode.gain.setValueAtTime(0.0001, start);
  gainNode.gain.linearRampToValueAtTime(gain, start + 0.012);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gainNode).connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

function safePlay(fn) {
  if (isSoundMuted()) return;
  try {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    fn(audioCtx);
  } catch {
    // Ses API'si desteklenmiyor veya kullanıcı etkileşimi bekleniyor - sessizce geç
  }
}

// Buton tıklaması - kısa, pofuduk "pop"
export function playPop() {
  safePlay((audioCtx) => {
    const t = audioCtx.currentTime;
    tone(audioCtx, { freq: 480, start: t, duration: 0.08, type: "sine", gain: 0.11, freqEnd: 680 });
  });
}

// Doğru cevap - neşeli kısa arpej
export function playCorrect() {
  safePlay((audioCtx) => {
    const t = audioCtx.currentTime;
    [523.25, 659.25, 783.99].forEach((f, i) => tone(audioCtx, { freq: f, start: t + i * 0.08, duration: 0.16, type: "triangle", gain: 0.13 }));
  });
}

// Yanlış cevap - yumuşak, cezalandırıcı olmayan "oops"
export function playWrong() {
  safePlay((audioCtx) => {
    const t = audioCtx.currentTime;
    tone(audioCtx, { freq: 320, start: t, duration: 0.22, type: "sine", gain: 0.09, freqEnd: 220 });
  });
}

// Coin kazanma / harcama - madeni para şıngırtısı
export function playCoin() {
  safePlay((audioCtx) => {
    const t = audioCtx.currentTime;
    tone(audioCtx, { freq: 988, start: t, duration: 0.09, type: "square", gain: 0.07 });
    tone(audioCtx, { freq: 1318.5, start: t + 0.06, duration: 0.14, type: "square", gain: 0.07 });
  });
}

// Büyük kutlama - tam puan / oyun kazanma
export function playCelebrate() {
  safePlay((audioCtx) => {
    const t = audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(audioCtx, { freq: f, start: t + i * 0.1, duration: 0.22, type: "triangle", gain: 0.14 }));
  });
}
