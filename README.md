# 🌍📊 AgriWeather - Aplicación Meteorológica 
Esta es una Single Page Application (SPA) diseñada para brindar información meteorológica en tiempo real, consultar datos climáticos históricos y analizar imágenes con inteligencia artificial.

La aplicación permite a los usuarios autenticarse, obtener su ubicación actual y visualizar datos meteorológicos relevantes. Además, pueden consultar registros climáticos históricos ingresando una ciudad y un año entre 2000 y 2025. Los datos se presentan en tablas interactivas y gráficos dinámicos.

También se incluye una funcionalidad basada en TensorFlow.js que permite capturar imágenes con la cámara del dispositivo (frontal o trasera) y analizar imágenes cargadas para predecir si contienen maíz o no.

El proyecto está desplegado en la siguiente dirección: https://luisafpg.github.io/AgriWeb/

## 🚀 Características

✔ Autenticación de usuarios con Firebase (Registro, inicio/cierre de sesión, recuperación de contraseña).

✔ Geolocalización: Muestra la ubicación actual del usuario (latitud y longitud) en un mapa interactivo.

✔ Información meteorológica en tiempo real basada en la ubicación.

✔ Consulta de datos climáticos históricos desde el año 2000 hasta 2025.

✔ Visualización de datos en tablas interactivas y gráficos dinámicos con DataTables.js y Chart.js.

✔ Captura y análisis de imágenes con TensorFlow.js para detectar la presencia de maíz en una imagen.

✔ Interfaz dinámica y responsiva optimizada con jQuery y Bootstrap.


## 🔧 Tecnologías Utilizadas
#### 🖥️ Frontend
- HTML5 - Estructura de la aplicación.
- CSS3 - Estilos y diseño responsivo.
- Bootstrap - Diseño responsivo y componentes visuales.
- JavaScript (ES6+) - Lenguaje principal del frontend.
- jQuery - Manipulación del DOM y eventos.

#### 📡 APIs y Librerías
- Firebase Authentication - Manejo de autenticación de usuarios.
- Leaflet.js - Para la visualización del mapa interactivo.
- Open-Meteo API - Para obtener datos climáticos en tiempo real e históricos.
- DataTables.js - Organización y gestión de tablas interactivas con filtros y exportación.
- Chart.js - Gráficos dinámicos basados en datos climáticos.
- TensorFlow.js, MobileNet - Capturar imágenes con la cámara del dispositivo (frontal o trasera) y analizar imágenes cargadas para predecir si contienen maíz o no.

## 🎯 Uso de la Aplicación
1️⃣ Autenticación:

- El usuario debe registrarse o iniciar sesión con su correo y contraseña.
- También puede recuperar su contraseña en caso de olvido.

2️⃣ Geolocalización e información meteorológica en tiempo real:

-  Una vez autenticado, la aplicación obtiene la ubicación actual (latitud y longitud) del usuario.
- Muestra un mapa interactivo con la posición exacta.
- Presenta la temperatura, humedad, velocidad del viento y precipitaciones actuales.

3️⃣ Consulta de datos climáticos históricos:

- El usuario puede ingresar una ciudad y un año (entre 2000 y 2025).
- Se obtiene la información climática de esa ubicación en el año seleccionado.
- Los datos se muestran en una tabla interactiva y en un gráfico dinámico.

4️⃣ Captura y análisis de imágenes con IA:
- El usuario puede capturar una imagen con la cámara frontal o trasera.
- También puede subir una imagen desde su dispositivo.
- TensorFlow.js analiza la imagen subida desde el dispositivo y predice si contiene maíz, algo de maíz o nada de maíz.


## 📸 Ejemplo de Uso

1️⃣ Un usuario inicia sesión en la aplicación.

2️⃣ Se obtiene y muestra su ubicación en un mapa.

3️⃣ Se muestra la información meteorológica actual.

4️⃣ Ingresa "Madrid" y el año "2015" para ver datos climáticos de ese año.

5️⃣ Aparece una tabla con los registros históricos y un gráfico con tendencias.

6️⃣ Se captura imágen con la cámara del dispositivo (frontal o trasera) y se analiza imágenes cargadas desde el dispositivo para predecir si contienen maíz o no.

## Instalación y Configuración
Clonar el repositorio:


     git clone https://github.com/tu_usuario/AgriWeb 
