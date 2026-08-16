const API_BASE = "https://api.github.com";

function getConfig() {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error(
      "Sunucu yapılandırması eksik: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO ortam değişkenlerini Vercel'de tanımlayın."
    );
  }
  return {
    token: GITHUB_TOKEN,
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    branch: GITHUB_BRANCH || "main",
  };
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// Bir dosyayı okur. Yoksa null döner.
export async function ghGetFile(path) {
  const { token, owner, repo, branch } = getConfig();
  const url = `${API_BASE}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${branch}`;
  const res = await fetch(url, { headers: authHeaders(token) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub okuma hatası (${res.status}): ${await res.text()}`);
  const json = await res.json();
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  return { content, sha: json.sha, path: json.path };
}

// JSON dosyasını okuyup parse eder. Yoksa fallback döner.
export async function ghGetJson(path, fallback = null) {
  const file = await ghGetFile(path);
  if (!file) return { data: fallback, sha: null };
  try {
    return { data: JSON.parse(file.content), sha: file.sha };
  } catch {
    return { data: fallback, sha: file.sha };
  }
}

// Bir dosyayı oluşturur ya da (sha verilirse) günceller.
export async function ghPutFile(path, contentString, message, sha = undefined) {
  const { token, owner, repo, branch } = getConfig();
  const url = `${API_BASE}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  const body = {
    message,
    content: Buffer.from(contentString, "utf-8").toString("base64"),
    branch,
    ...(sha ? { sha } : {}),
  };
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub yazma hatası (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function ghPutJson(path, dataObj, message, sha = undefined) {
  return ghPutFile(path, JSON.stringify(dataObj, null, 2), message, sha);
}

// Bir klasördeki dosyaları listeler. Klasör yoksa boş dizi döner.
export async function ghListDir(path) {
  const { token, owner, repo, branch } = getConfig();
  const url = `${API_BASE}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${branch}`;
  const res = await fetch(url, { headers: authHeaders(token) });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub listeleme hatası (${res.status}): ${await res.text()}`);
  const json = await res.json();
  return Array.isArray(json) ? json : [];
}

export function checkParentKey(req) {
  const provided = req.headers["x-parent-key"] || "";
  const expected = process.env.PARENT_ACCESS_KEY || "";
  return expected.length > 0 && provided === expected;
}
