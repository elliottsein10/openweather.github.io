const APIKEY = '65bf3940e6210f69f0027da184de1eeb';
const URLBASE = 'https://api.openweathermap.org/data/2.5/weather?';

async function request(url) {
    return fetch(url).then(result => result.json());
}

async function getClima(lat, lon) {
    const url = `${URLBASE}lat=${lat}&lon=${lon}&appid=${APIKEY}`;
    const data = await request(url);
    console.log("Temperatura: ", data.main.temp);
    console.log("Ciudad: ", data.name);
    updateDOM(data.main.temp, data.name);
}

document.getElementById('obtenerClima').addEventListener('click', function (e) {
    e.preventDefault();
    console.log("Botón Obtener Clima clickeado");
    const ciudadInput = document.getElementById('ciudadInput');
    const ciudad = ciudadInput.value;

    if (ciudad) {
        getManualClima(ciudad);
    } else {
        alert('Por favor, ingresa el nombre de la ciudad.');
    }
});

document.getElementById('obtenerManual').addEventListener('click', function (e) {
    e.preventDefault();
    console.log("Botón Obtener Manual clickeado");
    navigator.geolocation.getCurrentPosition(positions => {
        const lat = positions.coords.latitude;
        const lon = positions.coords.longitude;
        getClima(lat, lon);
    });
});

async function getManualClima(ciudad) {
    const manualUrl = `${URLBASE}q=${ciudad}&appid=${APIKEY}`;

    try {
        const data = await request(manualUrl);
        console.log("Temperatura: ", data.main.temp);
        console.log("Ciudad: ", data.name);
        updateDOM(data.main.temp, data.name);
    } catch (error) {
        console.error('Error al obtener el clima manual:', error);
        alert('No se pudo obtener el clima para la ciudad especificada.');
    }
}

async function updateDOM(temp, name) {
    const temperaturaElement = document.getElementById('temperatura');
    const ciudadElement = document.getElementById('ciudad');
    const body = document.body;
    const imagenContainer = document.getElementById('imagenContainer');

    // Convertir de Kelvin a Celsius y redondear a dos decimales
    const tempCelsius = temp - 273.15;
    const tempCelsiusRounded = parseFloat(tempCelsius.toFixed(2));

    temperaturaElement.textContent = `Temperatura: ${tempCelsiusRounded}°C`;
    ciudadElement.textContent = `Ciudad: ${name}`;

    // Remover clases de temperatura del cuerpo
    body.classList.remove('frio', 'cool', 'calor');

    // Limpiar contenedor de imágenes
    imagenContainer.innerHTML = '';

    // Lógica para seleccionar la imagen y clase según la temperatura
    if (tempCelsius <= 10) {
        console.log("Hace frío");
        body.classList.add('frio');
        imagenContainer.innerHTML = '<img src="./frio.gif" alt="Hace frío">';
    } else if (tempCelsius >= 10 && tempCelsius <= 24) {
        console.log("El día está fresco");
        body.classList.add('cool');
        imagenContainer.innerHTML = '<img src="./fresco.gif" alt="Día fresco">';
    } else {
        console.log("Hace calor");
        body.classList.add('calor');
        imagenContainer.innerHTML = '<img src="./calor.gif" alt="Hace calor">';
    }
}
