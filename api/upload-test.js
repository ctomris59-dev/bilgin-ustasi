import { ghPutJson, checkParentKey } from "../lib/githubServer.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Sadece POST desteklenir" });
    return;
  }

  if (!checkParentKey(req)) {
    res.status(401).json({ error: "Ebeveyn anahtarı geçersiz veya eksik" });
    return;
  }

  try {
    const { test } = req.body || {};
    if (!test || !test.id || !Array.isArray(test.questions)) {
      res.status(400).json({ error: "Geçersiz test verisi (id ve questions gerekli)" });
      return;
    }

    await ghPutJson(
      `data/tests/${test.id}.json`,
      test,
      `Yeni test yüklendi: ${test.id}`
    );

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
