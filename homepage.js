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
        second: '2-digit',
        timeZoneName: 'short'
    });

    document.getElementById('time-card').innerHTML =
        `<strong>Time:</strong> ${time}`;
}

updateTime();
setInterval(updateTime, 1000);


const lastfmUsername = "Darsolos";
const lastfmApiKey = "c57f5c3476f076a279ff7ffc8439b4a1";

function updateListening() {
    fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(lastfmUsername)}&api_key=${lastfmApiKey}&format=json&limit=1`
    )
        .then(response => response.json())
        .then(data => {
            const track = data.recenttracks.track[0];

            const artist = track.artist["#text"];
            const song = track.name;

            const listeningCard = document.getElementById("listening-card");

            if (track["@attr"] && track["@attr"].nowplaying === "true") {
                listeningCard.innerHTML =
                    `<strong>Listening to:</strong> ${artist} — ${song}`;
            } else {
                listeningCard.innerHTML =
                    `<strong>Last listened to:</strong> ${artist} — ${song}`;
            }
        })
        .catch(error => {
            console.error("Last.fm error:", error);

            document.getElementById("listening-card").innerHTML =
                `<strong>Listening to:</strong> N/A`;
        });
}

updateListening();
setInterval(updateListening, 30000);
