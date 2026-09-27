const lat = 45.5017;
const lon = -73.5673;

fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(response => response.json())
    .then(data => {
        const temp = data.current_weather.temperature;

        const weatherCard = document.getElementById('weather-card');

        weatherCard.innerHTML = `<strong>Weather:</strong> ${temp}°C`;
    })
    .catch(error => {
        console.error("Error fetching weather:", error);

        document.getElementById('weather-card').innerHTML =
            `<strong>Weather:</strong> Unavailable`;
    });

function updateTime() {
    const now = new Date();

    const time = now.toLocaleTimeString('en-US', {
        timeZone: 'America/Toronto',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    });

    document.getElementById('time-card').innerHTML =
        `<strong>Time:</strong> ${time} EST`;
}

updateTime();
setInterval(updateTime, 1000);
