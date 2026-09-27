const lat = 45.5017;
const lon = -73.5673;

fetch(`https://open-meteo.com{lat}&longitude=${lon}&current_weather=true`)
    .then(response => response.json())
    .then(data => {
        const temp = data.current_weather.temperature;
      
        const weatherCard = document.getElementById('weather-card');
        const li = weatherCard.querySelector('li');
        
        li.innerHTML = `<strong>Weather:</strong> ${temp}°C`;
    })
    .catch(error => {
        console.error("Error fetching weather:", error);
        document.querySelector('#weather-card li').innerHTML = `<strong>Weather:</strong> Unavailable`;
    });
