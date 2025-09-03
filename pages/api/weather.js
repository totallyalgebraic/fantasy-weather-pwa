import { get, set } from "@vercel/edge-config";

function getTodayInGMT8() {
  const now = new Date();
  const gmt8Now = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return gmt8Now.toISOString().split("T")[0]; // "2025-08-27"
}

export default async function handler(req, res) {
  try {
    const { lat, lon } = req.query;
    const today = getTodayInGMT8()
    const key = `weather:${today}`;

    const cached = await get(key);
    if (cached) {
      console.log("✅ Serving weather from Edge Config");
      return res.status(200).json(cached);
    }

    const apiKey = process.env.METEOSOURCE_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing METEOSOURCE_API_KEY in environment variables");
      return res.status(500).json({ error: "Server misconfigured: missing API key" });
    }

    const response = await fetch(
      `https://www.meteosource.com/api/v1/free/point?lat=${lat}&lon=${lon}&sections=daily&timezone=auto&language=en&units=auto&key=${apiKey}`
    );

    if (!response.ok) {
      console.error("❌ Weather API failed:", response.status, await response.text());
      return res.status(500).json({ error: "Weather API failed" });
    }

    const data = await response.json();

    await set(key, data);
    console.log("🌐 Fresh fetch & cached (GMT+08 reset)");

    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Unexpected error in /api/weather:", err);
    res.status(500).json({ error: "Unexpected server error" });
  }
}
