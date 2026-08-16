import { ghGetJson, ghListDir, ghGetFile } from "../lib/githubServer.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Sadece GET desteklenir" });
    return;
  }

  try {
    const { data: profile } = await ghGetJson("data/profile.json", null);

    const files = await ghListDir("data/tests");
    const jsonFiles = files.filter((f) => f.type === "file" && f.name.endsWith(".json"));

    const tests = [];
    for (const f of jsonFiles) {
      const file = await ghGetFile(f.path);
      if (!file) continue;
      try {
        tests.push(JSON.parse(file.content));
      } catch {
        // bozuk dosyayı atla
      }
    }

    res.status(200).json({ profile, tests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
