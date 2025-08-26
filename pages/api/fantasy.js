export default async function handler(req, res) {
    const { description, temp } = req.body;
    const prompt = `Rewrite this weather in a fantasy wizardly style:\nWeather: ${description}, Temp: ${temp}°C`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
        })
    });

    const data = await response.json();
    res.status(200).json({ text: data.choices[0].message.content });
}
