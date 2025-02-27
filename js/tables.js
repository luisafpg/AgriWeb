
//las funciones de este script exportables para su reutilizacion en el script principal

import { cargarGrafico } from './grafico.js';

// Función para llenar el selector de años, se generan los años desde 2000 hasta el año actual.
export function SelectAnos() {
    const anoActual = new Date().getFullYear();
    const desplegable = $("#inputAño");

    desplegable.empty(); // borra opciones previas

    for (let year = 2000; year <= anoActual; year++) {
        const option = $("<option></option>").val(year).text(year);
        desplegable.append(option);
    }
}


/**
 * función para obtener las coordenadas geográficas de una ciudad mediante la API de Open-Meteo.
 * 
 * @param {string} ciudad - Nombre de la ciudad.
 * @returns {Promise<{latitud: number, longitud: number, pais: string} | null>}
 */
async function obtenerCoordenadas(ciudad) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&language=es&count=1`;

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`);
        }

        const data = await respuesta.json();
        if (data.results && data.results.length > 0) {
            return {
                latitud: data.results[0].latitude,
                longitud: data.results[0].longitude,
                pais: data.results[0].country 
            };
        } else {
            console.error(`No se encontraron datos para la ciudad: ${ciudad}`);
            return null;
        }
    } catch (error) {
        console.error("Error al obtener coordenadas:", error);
        return null;
    }
}


// función para obtener datos meteorológicos históricos de una ciudad y un año específico
export async function datosHistoricos(ciudad, anno) {
    // obtener las coordenadas de la ciudad utilizando la función obtenerCoordenadas
    const coordenadas = await obtenerCoordenadas(ciudad);

    // si no se pudieron obtener las coordenadas, se muestra un error y se devuelve un array vacío
    if (!coordenadas) {
        console.error(`No se pudieron obtener coordenadas para ${ciudad}`);
        return [];
    }

    // extraer latitud, longitud y país de las coordenadas obtenidas
    const { latitud, longitud, pais } = coordenadas;

    //nombre completo de la ciudad con el país (si está disponible)
    const nombreCompleto = `${ciudad}, ${pais || "Desconocido"}`;

    // definir las fechas de inicio y fin para la consulta de datos del año seleccionado, primer y ultimo dia del año
    const fechaInicio = `${anno}-01-01`; 
    const fechaFin = `${anno}-12-31`; 

    //URL de la API para obtener datos históricos meteorológicos
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitud}&longitude=${longitud}&start_date=${fechaInicio}&end_date=${fechaFin}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`;

    try {
        
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            console.error(`Error al hacer la solicitud a la API: ${respuesta.status} ${respuesta.statusText}`);
            return [];
        }

        const datos = await respuesta.json();

        // Verificar si la estructura de datos obtenida es válida y contiene información útil
        if (!datos.daily || !datos.daily.time) {
            console.error(`No hay datos disponibles para ${ciudad} en el año ${anno}`);
            return [];
        }

        // procesar los datos y estructurarlos en un formato más organizado
        const datosCiudad = datos.daily.time.map((fecha, index) => ({
            ciudad: nombreCompleto, // nombre de la ciudad con el país
            fecha, // fecha del registro meteorológico
            temperaturaMax: datos.daily.temperature_2m_max[index], // temperatura máxima del día
            temperaturaMin: datos.daily.temperature_2m_min[index], // temperatura mínima del día
            precipitacion: datos.daily.precipitation_sum[index], // cantidad de precipitaciones
            viento: datos.daily.windspeed_10m_max[index] // velocidad máxima del viento
        }));

        // retornar los datos procesados para ser utilizados en la aplicación
        return datosCiudad;

    } catch (error) {
        // capturar y mostrar errores en la consola en caso de que falle la solicitud
        console.error(`Error obteniendo datos para ${ciudad} en el año ${anno}:`, error);
        return [];
    }
}



/**
 * función para actualizar la tabla de datos históricos con la información obtenida.
 * 
 * @param {Array} historicalData - Datos históricos de clima.
 */

export function actualizarDatosHistoricos(historicalData) {
    // comprobar si hay datos históricos para mostrar
    if (!historicalData || historicalData.length === 0) {
        console.error("No hay datos históricos para mostrar en la tabla.");
        $("#message").text("No hay datos disponibles para esta ciudad y año.").show();
        return;
    }

    // verificar si DataTable ya está inicializado y destruirlo para reiniciarlo con los nuevos datos
    if ($.fn.DataTable.isDataTable("#tablaHistorial")) {
        $("#tablaHistorial").DataTable().clear().destroy();
    }

    // inicializar la tabla con los nuevos datos
    $("#tablaHistorial").DataTable({
        data: historicalData.map((data) => [
            data.fecha,
            data.ciudad,
            new Date(data.fecha).getFullYear(),  // Añadir el año extraído de la fecha
            data.temperaturaMax,
            data.temperaturaMin,
            data.precipitacion,
            data.viento
        ]),
        columns: [
            { title: "Fecha" },
            { title: "Ciudad" },
            { title: "Año" },
            { title: "Temperatura Máxima (°C)" },
            { title: "Temperatura Mínima (°C)" },
            { title: "Precipitaciones (mm)" },
            { title: "Velocidad del Viento (km/h)" }
        ],
        dom: 'Bfrtip', // configuración de los botones de exportación
        buttons: [
            { extend: 'copyHtml5', text: '📋 Copiar', className: 'btn btn-sm btn-outline-primary' },
            { extend: 'csvHtml5', text: '📄 CSV', className: 'btn btn-sm btn-outline-success' },
            { extend: 'excelHtml5', text: '📊 Excel', className: 'btn btn-sm btn-outline-warning' },
            { extend: 'pdfHtml5', text: '📕 PDF', className: 'btn btn-sm btn-outline-danger' },
            { extend: 'print', text: '🖨️ Imprimir', className: 'btn btn-sm btn-outline-secondary' }
        ],
        destroy: true //permite volver a inicializar la tabla sin errores
    });

    // asegurarse de que la tabla esté visible
    if ($("#tablaHistorial").length > 0) {
        $('#tablaHistorial').show();
    } else {
        console.error("La tabla no existe en el DOM.");
    }

    // Llamar a la función para cargar el gráfico después de que la tabla se haya actualizado
    cargarGrafico(historicalData);
}











