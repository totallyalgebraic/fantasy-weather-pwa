import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey });

function getTodayInGMT8() {
    const now = new Date();
    const gmt8Now = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    return gmt8Now.toISOString().split("T")[0]; // "2025-08-27"
}

export default async function handler(req, res) {
    if (!apiKey) {
        console.error("❌ Missing OPENAI_API_KEY in environment variables");
        return res.status(500).json({ error: "Server misconfigured: missing API key" });
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { description, maxTemp, minTemp } = req.body || {};
    if (!description || !maxTemp || !minTemp) {
        return res.status(400).json({ error: "description and temps are required" });
    }

    const today = getTodayInGMT8()
    const key = `summary:${today}`;

    const cached = await get(key);
    if (cached) {
        console.log("✅ Serving summary from Edge Config");
        return res.status(200).json(cached);
    }

    const prompt = `Rewrite the given weather summary in a fantasy wizardly style. Keep it concise, no longer than 2 sentences, and avoid quoting the temperatures directly. Include details on what sort of clothing will be appropriate for the day.
    \nWeather summary: ${description}, max temperature: ${maxTemp}°C, min temperature: ${minTemp}°C`;

    try {
        const response = await openai.responses.create({
            model: "gpt-4.1-nano", // or "gpt-4o-mini"
            input: prompt
        });

        const completion = response.output_text;

        await set(key, { result: completion });
        console.log("🌐 Fresh fetch & cached (GMT+08 reset)");

        return res.status(200).json({ result: completion });
    } catch (error) {
        console.error("❌ OpenAI request failed:", error);
        return res.status(500).json({ error: "OpenAI request failed" });
    }
}
