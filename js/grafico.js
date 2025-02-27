
//la funcion de este script es exportable para reutilizarla en tables.js poder generar el grafico una ves mostrada la tabla

// variable para almacenar el gráfico y poder actualizarlo
let graficoChart; 

/**
 * función que genera y muestra un gráfico de líneas con datos meteorológicos
 * 
 * @param {Array} datos - Un array de objetos con la siguiente estructura:
 *   {
 *     fecha: "YYYY-MM-DD",
 *     temperaturaMax: Number,
 *     temperaturaMin: Number,
 *     precipitacion: Number,
 *     viento: Number
 *   }
 * 
 * La función destruye el gráfico previo (si existe) y genera uno nuevo basado en los datos proporcionados.
 * Retorna el objeto `graficoChart`, que contiene la instancia del gráfico generado.
 */
export function cargarGrafico(datos) {
    const ctx = document.getElementById("grafico-info").getContext("2d");


    if (graficoChart) {
        graficoChart.destroy();
    }

    /* 
     * Preprocesamos los datos para extraer las fechas y los valores de 
     * temperatura máxima, temperatura mínima, precipitación y velocidad del viento.
     */
    const fechas = datos.map(d => new Date(d.fecha)); 
    const temperaturaMax = datos.map(d => d.temperaturaMax); 
    const temperaturaMin = datos.map(d => d.temperaturaMin); 
    const precipitacion = datos.map(d => d.precipitacion); 
    const viento = datos.map(d => d.viento); 

    /* 
     * definimos los colores de cada línea en el gráfico para 
     * identificar claramente cada conjunto de datos.
     */
    const colorMax = "red";        // color para temperatura máxima
    const colorMin = "blue";       // color para temperatura mínima
    const colorPrecip = "green";   // color para precipitación
    const colorViento = "orange";  // color para velocidad del viento

    /* 
     * creamos los conjuntos de datos (datasets) que se mostrarán en el gráfico. 
     * cada conjunto de datos tiene su etiqueta, valores y color correspondiente.
     */
    const datasets = [
        {
            label: "Temperatura Máxima (°C)",
            data: temperaturaMax,
            borderColor: colorMax,
            backgroundColor: colorMax,
            fill: false
        },
        {
            label: "Temperatura Mínima (°C)",
            data: temperaturaMin,
            borderColor: colorMin,
            backgroundColor: colorMin,
            fill: false
        },
        {
            label: "Precipitación (mm)",
            data: precipitacion,
            borderColor: colorPrecip,
            backgroundColor: colorPrecip,
            borderDash: [5, 5], // línea discontinua para representar precipitación
            fill: false
        },
        {
            label: "Velocidad del Viento (km/h)",
            data: viento,
            borderColor: colorViento,
            backgroundColor: colorViento,
            borderDash: [10, 5], // línea discontinua para representar el viento
            fill: false
        }
    ];

    /* 
     * configuración y creación del gráfico de líneas utilizando Chart.js. 
     * se define el tipo de gráfico, los datos y las opciones de visualización.
     */
    graficoChart = new Chart(ctx, {
        type: "line", // tipo de gráfico: línea
        data: {
            labels: fechas, // etiquetas del eje X basadas en las fechas procesadas
            datasets: datasets // conjuntos de datos que se mostrarán en el gráfico
        },
        options: {
            responsive: true, 
            scales: {
                x: {
                    type: 'time', 
                    time: {
                        unit: 'day', 
                        tooltipFormat: 'PP' 
                    }
                },
                y: {
                    beginAtZero: false, 
                    title: {
                        display: true,
                        text: 'Temperatura (°C), Precipitación (mm) y Viento (km/h)' // título del eje Y
                    }
                }
            }
        }
    });
}





