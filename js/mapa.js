//importamos las funciones correspondinetes de clima.js para mostrar la informacion del clima de la ubicacion actual del usuario 
import { infoMeteorologica, actualizarInfo } from "./clima.js";

// las funciones de este script son ambas exportables para la reutilizacion en el script app.js que sería el main 

// función para crear y mostrar el mapa utilizando la biblioteca Leaflet
export function crearMapa() {
    // se inicializa el mapa en el contenedor con id 'map'
    // se establece la vista inicial con coordenadas [0, 0] (centro del mapa) y un nivel de zoom de 2
    const map = L.map('map').setView([0, 0], 2);

    // se añade una capa de mapa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // se devuelve el objeto mapa para su uso posterior
    return map;
}

// función para obtener la ubicación del usuario y actualizar el mapa con su posición
// se verifica si el navegador soporta la API de geolocalización
// se solicita la ubicación del usuario y se ejecuta una función cuando la posición está disponible, se obtiene la latitud y longitud
export function localizarUsuario(map) {
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude; 
            const lng = position.coords.longitude; 

            // se actualiza la vista del mapa centrando en la ubicación del usuario con un nivel de zoom de 13
            map.setView([lat, lng], 13);

            // se agrega un marcador en la ubicación actual del usuario
            const marker = L.marker([lat, lng]).addTo(map);
            
            // se vincula un popup al marcador con información de la ubicación, en este caso mostrando la long y la lat
            marker.bindPopup(`<b>Estás aquí</b><br>Latitud: ${lat}<br>Longitud: ${lng}`).openPopup();

            // se agrega un círculo alrededor de la ubicación del usuario con radio de 500 metros
            const circle = L.circle([lat, lng], {
                color: 'green', 
                fillColor: '#00f', 
                fillOpacity: 0.5, 
                radius: 500 
            }).addTo(map);

            // se actualizan los elementos HTML con la latitud y longitud del usuario
            $('#latitude').text(lat);
            $('#longitude').text(lng);

            // se obtiene y muestra la información meteorológica en función de la ubicación del usuario
            const climaData = await infoMeteorologica(lat, lng);
            actualizarInfo(climaData);
        }, () => {
            // manejo de error si la geolocalización falla o el usuario la bloquea o si el navegador no soporta la API de geolocalización
            console.error("No se pudo obtener la ubicación");
        });
    } else {
        
        console.error("La geolocalización no es compatible con este navegador");
    }
}



