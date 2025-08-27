import { useEffect, useState } from "react";

export default function Home() {
    const [weather, setWeather] = useState("");
    const [fantasyWeather, setFantasyWeather] = useState("");

    useEffect(() => {
        async function loadWeather() {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async pos => {
                    const res = await fetch(`/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
                    const data = await res.json();
                    setWeather(`${data.weather[0].description}, ${data.main.temp}°C`);

                    // Ask backend to fantasy-transform
                    const fantasyRes = await fetch(`/api/fantasy`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ description: data.weather[0].description, temp: data.main.temp })
                    });
                    const fantasy = await fantasyRes.json();

                    setFantasyWeather(fantasy.result);
                });
            }
        }
        loadWeather();
    }, []);

    return (
        <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "50px" }}>
            <h1>🌤 Fantasy Weather</h1>
            <p><strong>Real Weather:</strong> {weather}</p>
            <p><strong>Fantasy Report:</strong> {fantasyWeather}</p>
        </div>
    );
}
