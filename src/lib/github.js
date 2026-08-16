// Bu dosya, tarayıcıdan doğrudan GitHub'a DEĞİL, kendi Vercel Serverless
// fonksiyonlarımıza (/api/*) istek atar. GitHub token'ı her zaman sunucu
// tarafında (Vercel ortam değişkeni) gizli kalır, tarayıcıya asla gönderilmez.

const PARENT_HEADER = "x-parent-key";

function getParentKey() {
  return sessionStorage.getItem("bilginustasi_parent_key") || "";
}

async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      [PARENT_HEADER]: getParentKey(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API hatası (${res.status}): ${text || res.statusText}`);
  }
  return res.json();
}

// Bulut profilini ve mevcut testleri çeker
export async function fetchCloudData() {
  return apiFetch("/api/get-data", { method: "GET" });
}

// Güncellenmiş profili buluta yazar (her test sonrası çağrılır)
export async function pushProfile(profile) {
  return apiFetch("/api/save-result", {
    method: "POST",
    body: JSON.stringify({ profile }),
  });
}

// Ebeveyn panelinden yeni test yükler (data/tests/ altına commit atar)
export async function uploadTest(test) {
  return apiFetch("/api/upload-test", {
    method: "POST",
    body: JSON.stringify({ test }),
  });
}

export function setParentKey(key) {
  sessionStorage.setItem("bilginustasi_parent_key", key);
}

export function hasParentKey() {
  return !!getParentKey();
}
