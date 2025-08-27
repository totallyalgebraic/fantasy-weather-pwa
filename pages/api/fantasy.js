import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey });

export default async function handler(req, res) {
    if (!apiKey) {
        console.error("❌ Missing OPENAI_API_KEY in environment variables");
        return res.status(500).json({ error: "Server misconfigured: missing API key" });
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { description, temp } = req.body || {};
    if (!description || !temp) {
        return res.status(400).json({ error: "description and temp are required" });
    }

    const prompt = `Rewrite this weather in a fantasy wizardly style:\nWeather: ${description}, Temp: ${temp}°C`;

    try {
        const response = await openai.responses.create({
            model: "gpt-4.1-nano", // or "gpt-4o-mini"
            input: prompt
        });

        const completion = response.output_text;

        return res.status(200).json({ result: completion });
    } catch (error) {
        console.error("❌ OpenAI request failed:", error);
        return res.status(500).json({ error: "OpenAI request failed" });
    }
}
