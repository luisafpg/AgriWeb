//ambas funciones exportables, para utilizarlas en mapa.js para mostrar esa informacion
// función para obtener la información meteorológica
export async function infoMeteorologica(lat, lon) {
    // construcción de la URL con los parámetros de latitud y longitud proporcionados
    // se utiliza la API Open-Meteo para obtener datos climáticos en función de la ubicación
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,apparent_temperature,visibility,pressure_msl,uv_index,precipitation,cloudcover&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    try {
        // realiza la solicitud a la API usando fetch y espera la respuesta
        // y convierte la respuesta en formato JSON
        const response = await fetch(url);
        const climaData = await response.json();

        // retorna un objeto con los datos meteorológicos más relevantes
        return {
            temperature: climaData.hourly.temperature_2m[0], // Temperatura actual
            humidity: climaData.hourly.relativehumidity_2m[0], // Humedad relativa
            windSpeed: climaData.hourly.windspeed_10m[0], // Velocidad del viento
            precipitation: climaData.hourly.precipitation[0], // Precipitación
            tempMax: climaData.daily.temperature_2m_max[0], // Temperatura máxima del día
            tempMin: climaData.daily.temperature_2m_min[0] // Temperatura mínima del día
        };
    } catch (error) {
        // captura cualquier error durante la solicitud y lo muestra en la consola
        console.error("Error al obtener datos meteorológicos:", error);
    }
}

// función para actualizar la tarjeta con información meteorológica
export function actualizarInfo(climaData) {
    // se actualizan los valores en la tabla usando jQuery
    // cada campo es identificado por su ID y se le asigna el valor correspondiente del objeto climaData
    $('#temperature').text(climaData.temperature); 
    $('#humidity').text(climaData.humidity); 
    $('#wind-speed').text(climaData.windSpeed); 
    $('#precipitation').text(climaData.precipitation); 
    $('#temp-max').text(climaData.tempMax); 
    $('#temp-min').text(climaData.tempMin); 
}



