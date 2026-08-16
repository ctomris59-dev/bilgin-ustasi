import { checkParentKey } from "../lib/githubServer.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Sadece POST desteklenir" });
    return;
  }
  res.status(200).json({ ok: checkParentKey(req) });
}
