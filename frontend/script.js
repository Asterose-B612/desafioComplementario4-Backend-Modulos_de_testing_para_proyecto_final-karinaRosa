
//interactúa con un botón en una página web para realizar una solicitud a un servidor y mostrar la respuesta en un elemento HTML.

// Obtiene una referencia al botón con el ID 'botonBienvenida'
const botonBienvenida = document.getElementById('botonBienvenida');

// Agrega un evento de clic al botón 'botonSaludo'
botonBienvenida.addEventListener('click', () => {
    // Realiza una solicitud GET al servidor en la dirección 'http://localhost:5500/bienvenida'
 fetch('http://127.0.0.1:5500')

        // Una vez que la solicitud es completada, convierte la respuesta a formato JSON
        .then(response => response.json())
        // Después de convertir la respuesta a JSON, ejecuta esta función con los datos recibidos
        .then(data => {
            // Actualiza el contenido del elemento con ID 'divBienvenida' en la página HTML
            // con el mensaje recibido del servidor
            document.getElementById('divBienvenida').innerHTML = `Adelante! ${data.mensaje}`;
        })
        // Si hay algún error en la solicitud, muestra el error en la consola
        .catch(e => console.log(e));
});
