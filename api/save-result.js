import { ghGetJson, ghPutJson } from "../lib/githubServer.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Sadece POST desteklenir" });
    return;
  }

  try {
    const { profile } = req.body || {};
    if (!profile) {
      res.status(400).json({ error: "profile alanı gerekli" });
      return;
    }

    const { sha } = await ghGetJson("data/profile.json", null);
    const updated = { ...profile, lastSyncedAt: new Date().toISOString() };

    await ghPutJson(
      "data/profile.json",
      updated,
      `Profil güncellendi - ${new Date().toISOString()}`,
      sha || undefined
    );

    res.status(200).json({ ok: true, profile: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
