export default async function handler(req, res) {
  try {
    const { lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing OPENWEATHER_API_KEY in environment variables");
      return res.status(500).json({ error: "Server misconfigured: missing API key" });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      console.error("❌ Weather API failed:", response.status, await response.text());
      return res.status(500).json({ error: "Weather API failed" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Unexpected error in /api/weather:", err);
    res.status(500).json({ error: "Unexpected server error" });
  }
}
