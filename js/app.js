
//importamos todas las funciones necesarias para manejar la logica pricnipal del programa
import { loginUsuario, registroUsuario, recuperarPassword, logoutUsuario} from './auth.js';
import { crearMapa, localizarUsuario } from './mapa.js';
import { SelectAnos, actualizarDatosHistoricos, datosHistoricos } from './tables.js';
import { cargarModelo, predecirMaiz } from './tensorflow.js';

//cuando el documento este completamente cargado...
$(document).ready(() => {
    let map; // variable para almacenar el mapa
    let videoStream = null; // almacena la transmisión de video de la cámara
    let modelo = null; // almacena el modelo de predicción de maíz

    //cargar los años disponibles en la selección al iniciar
    SelectAnos();

    //manejo de registro del usuario, evento para registrar un usuario cuando se hace clic en el botón de registro
    //Llama a la función que maneja autenticación
    $('#register').on('click', async (e) => {
        e.preventDefault();
        const email = $('#email-input').val();
        const password = $('#password-input').val();
        manejarAccionAutenticacion(registroUsuario, email, password, 'registro');
    });

    //manejo de inicio de sesion, evento para iniciar sesión cuando se envía el formulario
    $('#login-form').on('submit', async (e) => {
        e.preventDefault();
        const email = $('#email-input').val();
        const password = $('#password-input').val();
        manejarAccionAutenticacion(loginUsuario, email, password, 'inicio de sesión');
    });

    //manejo de recuperacion de contraseña
    $('#recover-password').on('click', async (e) => {
        e.preventDefault();
        const email = $('#email-input').val();
        manejarAccionAutenticacion(recuperarPassword, email, null, 'recuperación de contraseña');
    });

    //manejo de cerrar sesion, llamamos a la funcion para cerrar sesion
    $('#logout-btn').on('click', async (e) => {
        e.preventDefault();
        try {
            await logoutUsuario();
            $('#main-container').addClass('d-none'); // oculta el contenido principal
            $('#login-container').removeClass('d-none'); // muestra el formulario de login
            $('#logout-btn').addClass('d-none'); // oculta el botón de logout

            // si hay un mapa cargado, lo elimina
            if (map) {
                map.remove();
                map = null;
            }

            //restablece las imagenes
            resetImages();

            infoMensaje("Sesión cerrada correctamente.", 'success');
        } catch (error) {
            infoMensaje(`Error al cerrar sesión: ${error.message}`, 'danger');
        }
    });


    // Evento para agregar datos históricos de una ciudad en un año específico
    $('#btnAgregarCiudad').on('click', async (e) => {
        e.preventDefault();
        const ciudad = $('#inputCiudad').val();
        const ano = $('#inputAño').val();

        if (!ciudad || !ano) {
            alert("Por favor, ingrese una ciudad y seleccione un año.");
            return;
        }

        try {
            const historicalData = await datosHistoricos(ciudad, ano); // obtiene los datos históricos
            if (Array.isArray(historicalData) && historicalData.length > 0) {
                actualizarDatosHistoricos(historicalData); // actualiza la tabla con los datos obtenidos
                infoMensaje(`Datos climáticos de ${ciudad} en ${ano} agregados correctamente.`, 'success');
            } else {
                alert(`No se encontraron datos para ${ciudad} en el año ${ano}.`);
            }
        } catch (error) {
            alert(`Error al obtener datos históricos: ${error.message || error}`);
        }
    });


// función para manejar las acciones de autenticación (registro, login, recuperación de contraseña)
async function manejarAccionAutenticacion(accion, email, password, nombreAccion) {
    try {
        if (nombreAccion === 'recuperación de contraseña') {
            await accion(email); // si es recuperación, solo se envía el email
        } else {
            await accion(email, password); // si es login o registro, se envía email y contraseña
        }
        infoMensaje(`${nombreAccion.charAt(0).toUpperCase() + nombreAccion.slice(1)}, exitoso.`, 'success');
        manejarPostInicioSesion(nombreAccion);
    } catch (error) {
        infoMensaje(`Error en el ${nombreAccion}: ${error.message || error}`, 'danger');
    }
}
    
// función que maneja lo que sucede después de iniciar sesión
    function manejarPostInicioSesion(nombreAccion) {
        if (nombreAccion === 'inicio de sesión') {
            $('#login-container').addClass('d-none');
            $('#main-container').removeClass('d-none');
            $('#logout-btn').removeClass('d-none');
            if (!map) {
                map = crearMapa();
                localizarUsuario(map);
            }
        }
    }

    //función que carga el modelo de TensorFlow
    async function inicializarModelo() {
        modelo = await cargarModelo();
    }
    inicializarModelo();


// función para iniciar la cámara y mostrar el video en pantalla
async function startCamera(facingMode = 'user') {
    // Si ya hay una transmisión de video activa (la cámara está encendida), detenemos todos sus tracks (pistas)
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop()); // se detienen todas las pistas del flujo de video
    }

    try {
        // solicitamos acceso a la cámara del dispositivo usando la API de MediaDevices
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode } // 'user' para la cámara frontal, 'environment' para la trasera
        });

        // asignamos el flujo de video capturado al elemento <video> en el HTML
        $('#video').prop('srcObject', videoStream).show(); // mostramos el video en pantalla

        // ocultamos el contenedor del canvas (que se usa para mostrar una foto capturada)
        $('#canvas-container, #uploaded-image').hide(); // oculta el canvas y la imagen subida

    } catch (error) {
        // si ocurre un error (por ejemplo, el usuario deniega el permiso de la cámara), mostramos una alerta
        alert('No se pudo acceder a la cámara. Asegúrate de que tu navegador tenga permisos para usar la cámara.');
    }
}

    // eventos para encender la cámara frontal o trasera
    $('#startFrontCamera').on('click', () => startCamera('user'));
    $('#startRearCamera').on('click', () => startCamera('environment'));


    // evento que se activa cuando se hace clic en el botón con id 'capturePhoto'
$('#capturePhoto').on('click', () => {  
    // obtiene el elemento <video> donde se muestra la cámara
    const video = $('#video')[0];  
    
    // obtiene el elemento <canvas> donde se dibujará la captura
    const canvas = $('#canvas')[0];  
    
    // obtiene el contexto 2D del canvas para poder dibujar la imagen en él
    const context = canvas.getContext('2d');  

    // ajusta el tamaño del canvas al mismo tamaño que el video
    canvas.width = video.videoWidth;  
    canvas.height = video.videoHeight;  

    // si el tamaño del canvas es 0, se cancela la captura para evitar errores
    if (canvas.width === 0 || canvas.height === 0) return;  

    // dibuja el fotograma actual del video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);  

    // convierte la imagen del canvas a una URL en formato PNG y la asigna a la etiqueta <img> con id 'captured-photo'
    $('#captured-photo').attr('src', canvas.toDataURL('image/png')).show();  

    // muestra el contenedor del canvas para visualizar la imagen capturada
    $('#canvas-container').show();  

    // oculta el video después de capturar la foto
    $('#video').hide();  
});



// función para manejar la carga de imágenes
// evento que se activa cuando el usuario selecciona un archivo en el input con id 'upload-image'
$('#upload-image').on('change', (event) => {  
    // obtiene el archivo seleccionado por el usuario
    const file = event.target.files[0];  

    // si no se seleccionó ningún archivo, se detiene la ejecución
    if (!file) return;  

    // crea un objeto FileReader para leer el archivo
    const reader = new FileReader();  

    // evento que se ejecuta cuando FileReader termina de leer el archivo
    reader.onload = (e) => {  
        // asigna la imagen cargada al elemento <img> con id 'uploaded-image' y la muestra
        $('#uploaded-image').attr('src', e.target.result).show();  

        // oculta el contenedor del canvas y el video, ya que se muestra la imagen cargada
        $('#canvas-container, #video').hide();  

        // crea un nuevo objeto de imagen para procesarla posteriormente
        const image = new Image();  
        image.src = e.target.result;  

        // cuando la imagen se haya cargado completamente, se llama a la función procesarImagen()
        image.onload = () => procesarImagen(image);  
    };  

    // convierte el archivo seleccionado en una URL en base64 para poder visualizarlo en la página
    reader.readAsDataURL(file);  
});



// función asíncrona para procesar una imagen y realizar una predicción
async function procesarImagen(imagen) {
    // verifica si el modelo de predicción está cargado
    if (!modelo) {
        console.error("El modelo no está cargado aún.");  
        return;  
    }

    // llama a la función predecirMaiz() pasando el modelo y la imagen, esperando el resultado
    const prediccion = await predecirMaiz(modelo, imagen);

    // verifica si la predicción indica que la imagen contiene maíz
    if (prediccion.esMaiz) {
        // muestra el resultado en el elemento con id 'prediction-result'
        // indica la probabilidad de que haya maíz en la imagen, en porcentaje
        $('#prediction-result').text(`Este maíz tiene un ${Math.round(prediccion.probabilidad * 100)}% de probabilidad de estar en tu cultivo.`)
            .css('color', 'green');  // muestra el mensaje en color verde si hay maíz
    } else {
        // si no se detecta maíz, muestra un mensaje de advertencia en rojo
        $('#prediction-result').text("No se detectó maíz en la imagen.")
            .css('color', 'red');
    }
}


//función para mostrar los mensajes correspondientes sea de exito o de error
function infoMensaje(mensaje, tipo) {
    $('#message').text(mensaje).removeClass('text-danger text-success')
        .addClass(tipo === 'success' ? 'text-success' : 'text-danger').show();
}


//función para restablecer imágenes cuando el usuario cierra sesión
    function resetImages() {
        $('#captured-photo').hide();
        $('#uploaded-image').hide();
        $('#canvas-container').hide();
        $('#video').show();
    }
});















