

// Obtiene una referencia al botón con el ID 'botonBuscar1'
const botonBuscar1 = document.getElementById('botonBuscar1');
// Obtiene una referencia al botón con el ID 'botonBuscar2' (Nota: el nombre del ID debe coincidir exactamente)
const botonBuscar2 = document.getElementById('botonBuscar2')


// Agrega un evento de clic al botón 'botonBuscar1'
botonBuscar1.addEventListener('click', () => {

    // Realiza una solicitud HTTP GET a la URL 'http://localhost:8000/api/products'
    fetch('http://localhost:8000/api/products')

        // Una vez que la solicitud es completada, convierte la respuesta a formato JSON
        .then(response => response.json())
        // Después de convertir la respuesta a JSON, ejecuta esta función con los datos recibidos
        .then((products) => {
            // Imprime los datos recibidos en la consola
            console.log(products)
        })
});


// Agrega un evento de clic al botón 'botonBuscar2'
botonBuscar2.addEventListener('click', () => {
    // Realiza una solicitud HTTP GET a la URL 'http://localhost:8000/api/products/6600835524b605c03327f7da'  que pertenece al id de un producto de mi base de datos.
    fetch('http://localhost:8000/api/products/6600835524b605c03327f7da')

        // Una vez que la solicitud es completada, convierte la respuesta a formato JSON
        .then(res => res.json())
        // Después de convertir la respuesta a JSON, ejecuta esta función con los datos recibidos
        .then((prod) => {
            // Imprime los datos recibidos en la consola
            console.log(prod)
        })
})

