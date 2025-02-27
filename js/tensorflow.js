// estas funciones exportadas para la reutilizacion en el script principal

/**
 * Función para cargar el modelo MobileNet en el navegador
 * 
 * @returns {Promise<Object>} - Devuelve una promesa que resuelve con el modelo cargado
 */
export async function cargarModelo() {
    // cargar el modelo MobileNet directamente desde el navegador.
    // mobileNet es una red neuronal preentrenada utilizada para la clasificación de imágenes
    const modelo = await mobilenet.load();

    console.log("Modelo cargado exitosamente"); 

    return modelo; // retorna el modelo cargado para su posterior uso.
}

/**
 * función para predecir si una imagen contiene maíz usando el modelo MobileNet.
 * 
 * @param {Object} modelo - Modelo de MobileNet previamente cargado.
 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} imagen - Imagen a clasificar
 * 
 * @returns {Promise<{esMaiz: boolean, probabilidad: number}>} - 
 *          Un objeto con:
 *            - `esMaiz`: true si se detecta maíz, false en caso contrario.
 *            - `probabilidad`: nivel de confianza de la detección (entre 0 y 1).
 */
export async function predecirMaiz(modelo, imagen) {
    // ejecuta la clasificación de la imagen con el modelo.
    const predicciones = await modelo.classify(imagen);

    // palabra clave utilizada para identificar imágenes relacionadas con el maíz.
    const palabraClaveMaiz = 'corn';

    // busca si alguna de las predicciones contiene la palabra "corn" en su nombre de clase.
    let coincidencia = predicciones.find(prediccion => 
        prediccion.className.toLowerCase().includes(palabraClaveMaiz)
    );

    if (coincidencia) {
        // si se detecta maíz, se devuelve el resultado con la probabilidad correspondiente.
        return { esMaiz: true, probabilidad: coincidencia.probability };
    } else {
        // si no se encuentra maíz, se devuelve `esMaiz: false` con probabilidad 0.
        return { esMaiz: false, probabilidad: 0 };
    }
}







