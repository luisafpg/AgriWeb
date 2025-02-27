//todas las funciones de este script exportables para la reutilizacion en el script principal

//Importación de Firebase y módulos de autenticación
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";  
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

//importación de la configuración de Firebase desde un archivo externo
// sste archivo debe contener el objeto de configuración con las credenciales necesarias para conectar con el proyecto en Firebase.
import firebaseConfig  from "./firebase_config.js";

// inicializar Firebase con la configuracion importada
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* 
 * función para registrar un usuario en Firebase Authentication.
 * Parámetros:
 *  - email: Correo electrónico del usuario.
 *  - password: Contraseña del usuario.
 * Retorna:
 *  - Una promesa que se resuelve con el usuario registrado o lanza un error en caso de fallo.
 */
export function registroUsuario(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user; 
            console.log("Usuario registrado:", user.email);

            $("#message").text("Usuario registrado exitosamente").show();
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMesage = error.message;
            console.error("Error en el registro:", errorCode, errorMesage);
            $("#message").text(errorMesage).show();
            throw error;
        });
}

/* 
 * función para iniciar sesión con Firebase Authentication.
 * Parámetros:
 *  - email: Correo electrónico del usuario.
 *  - password: Contraseña del usuario.
 * Retorna:
 *  - Una promesa que se resuelve con el usuario autenticado o lanza un error en caso de fallo.
 */
export function loginUsuario(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Usuario autenticado:", user.email);
            //oculta el formulario de login y muestra la interfaz principal
            $("#login-container").hide();
            $("#main-container").removeClass("d-none");
            $("#message").text("").hide();
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMesage = error.message;
            console.error("Error en el inicio de sesión:", errorCode, errorMesage);
            $("#message").text(errorMesage).show();
            throw error;
        });
}

/* 
 * función para cerrar la sesión del usuario en Firebase Authentication.
 * Retorna:
 *  - Una promesa que se resuelve cuando el usuario se desloguea o lanza un error en caso de fallo.
 */
export function logoutUsuario() {
    return signOut(auth).then(() => {
        console.log("Sesión cerrada");
        // oculta la interfaz principal y muestra el formulario de login
        $("#main-container").addClass("d-none");
        $("#login-container").show();
        $("#message").text("Sesión cerrada").show();
    }).catch((error) => {
        console.error("Error al cerrar sesión:", error);
        $("#message").text("Error al cerrar sesión").show();
        throw error;
    });
}

/* 
 * función para enviar un correo de recuperación de contraseña.
 * Parámetros:
 *  - email: Correo electrónico del usuario que solicita recuperar su contraseña.
 * Retorna:
 *  - Una promesa que se resuelve cuando se envía el correo de recuperación o lanza un error en caso de fallo.
 */
export function recuperarPassword(email) {
    return sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Correo de recuperación enviado");
            // Muestra un mensaje indicando que el correo ha sido enviado
            $("#message").text("Correo de recuperación enviado").show();
        })
        .catch((error) => {
            console.error("Error al enviar correo de recuperación:", error);
            $("#message").text("Error al enviar correo de recuperación").show();
            throw error;
        });
}




