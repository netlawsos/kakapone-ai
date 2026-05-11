export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY が未設定です" });

  const MODEL = "gemini-3-flash-preview";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}