/*Entrega N°1:
Desarrollo de un servidor que contenga los endpoints y servicios necesarios para gestionar los productos y carritos de compra en el e-commerce
*basado en node.js y express
*que escuche en puerto 8080
*disponga de 2 grupos de rutas: 
   1-/products    2-/carts
* Dichos endopints estaran implementados con el router de express, con las siguientes espicificaciones:
   -PARA EL MANEJO DE PRODUCTOS
    tendra su router en /api/products/, configurar las siguientes rutas:
      *La ruta raíz GET/ debera listar todos los productos de la base (incluyendo la limitacion ?limit del desafio anterior)
      *La ruta GET/:pid deberá traer solo el producto con el id proporcionado

      *La ruta POST/ deberá agregar un nuevo producto con los campos:
          -id: Number/String (a tu eleccion, el ID NO SE MANDA DESDE EL BODY, se autogenera con el crypto, asegurando que nunca se repetiran los id en el archivo.)
          -title:String
          -description:String
          -code:String
          -proce:Number
          -status:Boolean
          -stock:Number
          -category:String
          -Thumbnails: Array de Strings que contenga las rutas donde estan almacenadas las imágenes referente a dicho producto.
                  *STATUS ES TRUE POR DEFECTO
                  *TODOS LOS CAMPOS SON OBLIGATORIOS, A EXCEPCION DE THUMBNAILS

      *La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body.
        NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.
        La ruta DELETE /:pid deberá eliminar el producto con el pid indicado.

   -PARA EL CARRITO, el cual tendrá su router en /api/carts/
    configurar dos rutas:
      *La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
              -Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
              -products: Array que contendrá objetos que representen cada producto          
      *La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.

      *La ruta POST /:cid/product/:pid deberá agregar el producto al arreglo "products" del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
                   -product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
                   -quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
                   Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto.


La persistencia de la información se implementará utilizando el file system, donde los archivos "productos,json" y "carrito.json", respaldan la información.
No es necesario realizar ninguna implementación visual, todo el flujo se puede realizar por Postman o por el cliente de tu preferencia.

Formato: Link al repositorio de Github con el proyecto completo, sin la carpeta de Node_modules.
Sugerencias: No olvides app.use(express.json()). No es necesario implementar multer
*/

// Importa el módulo Express para crear el servidor
import express from 'express';

// Se crea una instancia de Express para configurar el servidor.
const app = express();

// Se define el puerto en el que el servidor estará escuchando.
const PORT = 8000;

//el servidor podrá recibir json al momento de la petición
app.use(express.json())
//permite que se pueda mandar informacion tambien desde la URL
app.use(express.urlencoded({ extended: true }))


//********METDOS GET***************


// En la ruta inicial ("/"), responde con un mensaje indicando que se ha creado recientemente un servidor en Express.
app.get('/', (req, res) => {
    res.send("Servidor creado recientemente en Express");
})
















// Se define el servidor utilizando la variable 'app'.
// El servidor escucha en el puerto definido por la variable 'PORT'.
// Cuando el servidor está activo, se ejecuta una función anónima para mostrar un mensaje de estado en la consola.
app.listen(PORT, () => {
    // Muestra un mensaje en la consola indicando que el servidor está activo y escuchando en el puerto especificado.
    console.log(`Server on port ${PORT}`);
});


/*
RESUMEN: Se implementó un CRUD (Crear, Leer, Actualizar, Eliminar) para gestionar los productos utilizando el ProductManager.
Las operaciones incluyen:
- Obtener todos los productos y obtener un producto por su ID.
- Agregar un nuevo producto.
- Actualizar un producto existente.
- Eliminar un producto.
*/
