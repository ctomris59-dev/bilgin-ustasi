export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text, { rate = 0.95 } = {}) {
  if (!isSpeechSupported() || !text) return false;
  try {
    window.speechSynthesis.cancel(); // önceki okumayı durdur, üst üste binmesin
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "tr-TR";
    utter.rate = rate;
    utter.pitch = 1.05;
    window.speechSynthesis.speak(utter);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
