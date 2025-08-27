import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error("Missing OPENAI_API_KEY in environment variables");
    return res.status(500).json({ error: "Server misconfigured: missing API key" });
}

const openai = new OpenAI({
    apiKey: apiKey,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { description, temp } = req.body;
    const prompt = `Rewrite this weather in a fantasy wizardly style:\nWeather: ${description}, Temp: ${temp}°C`;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await openai.responses.create({
            model: "gpt-4.1-nano", // or "gpt-4", "gpt-3.5-turbo"
            input: prompt
        });

        const completion = response.output_text;

        res.status(200).json({ result: completion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "OpenAI request failed" });
    }
}

