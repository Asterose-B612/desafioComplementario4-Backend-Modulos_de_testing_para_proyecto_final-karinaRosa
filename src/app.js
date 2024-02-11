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
// Importa la clase ProductManager desde el módulo correspondiente
import { ProductManager } from './config/ProductManager.js';


// Se crea una instancia de Express para configurar el servidor.
const app = express();

// Se define el puerto en el que el servidor estará escuchando.
const PORT = 8000;

// Se crea una instancia de ProductManager para manejar la gestión de productos.
const productManager = new ProductManager('./src/data/products.json');

//el servidor podrá recibir json al momento de la petición
app.use(express.json())
//permite que se pueda mandar informacion tambien desde la URL
app.use(express.urlencoded({ extended: true }))


//********METDOS GET***************


// En la ruta inicial ("/"), responde con un mensaje indicando que se ha creado recientemente un servidor en Express.
app.get('/', (req, res) => {
    res.send("Servidor creado recientemente en Express");
})

// Esta ruta maneja las solicitudes GET a '/products'.
// Recibe opcionalmente el parámetro 'limit' desde la URL para limitar la cantidad de productos devueltos.
app.get('/products', async (req, res) => {
    try {
        // Paso 1: Obtiene el parámetro 'limit' de la consulta HTTP.
        const { limit } = req.query;
        
        // Paso 2: Obtiene todos los productos del gestor de productos.
        const PRODS = await productManager.getProducts();
        
        // Paso 3: Verifica si el parámetro 'limit' está presente en la consulta HTTP.
        if (limit !== undefined) {
            // Paso 4: Convierte el valor del parámetro 'limit' en un número entero.
            const LIMITE = parseInt(limit);
            // Paso 5: Verifica si el valor del parámetro 'limit' es un número válido y mayor o igual que cero.
            if (!isNaN(LIMITE) && LIMITE >= 0) {
                // Paso 6: Si el límite es válido, limita el número de productos a mostrar.
                const prodsLimit = PRODS.slice(0, LIMITE);
                // Paso 7: Devuelve una respuesta con el código de estado 200 (OK) y los productos limitados.
                return res.status(200).send(prodsLimit);
            } else {
                // Paso 8: Si el valor del parámetro 'limit' es inválido o negativo, devuelve un mensaje de error 400 (Bad Request).
                return res.status(400).send("ERROR: El parámetro 'limit' debe ser un número válido mayor o igual a cero.");
            }
        }

        // Paso 9: Si no se proporciona un límite, se envían todos los productos.
        return res.send(PRODS);
    } catch (e) {
        // Paso 10: Captura cualquier error que pueda ocurrir durante la consulta de productos y devuelve un mensaje de error con el código de estado 500 (Internal Server Error).
        res.status(500).send(`Error interno del servidor al consultar productos: ${e}`);
    }
});





// Esta ruta maneja la consulta de productos. El identificador de producto (pid) no es un valor fijo, es generado por crypto.

app.get('/products/:pid', async (req, res) => {

    try {
        // Paso 1: Consulta el parámetro de la solicitud para obtener el identificador del producto.
        const PRODUCTID = req.params.pid
        // Paso 2: Consulta en la base de datos el producto con el ID proporcionado.
        /* Nota: Todo dato consultado desde un parámetro es de tipo string. Si el ID es numérico, se necesita convertirlo. */
        // Llama a ProductManager para devolver el producto con el ID solicitado.
        const PROD = await productManager.getProductById(PRODUCTID)

        // Paso 3: Si producto existe, lo devuelve. Sino, devuelve un mensaje de error 404 al cliente por solicitar un ID que no existe.
        if (PROD) {
            if (PROD) {

                res.status(200).send(PROD)
                // Devuelve el producto con el código de estado 200 (OK).

            } else {
                res.status(404).send("Producto no encontrado")
                // Devuelve un mensaje de error 404 (Not Found).
            }
        }

    } catch (e) {
        res.status(500).send(`Error interno del servidor al consultar producto: ${e}`)
        // Paso 4: Si ocurre algún error durante la consulta del producto, se maneja aquí y se devuelve un mensaje de error 500 (Internal Server Error).
    }

})


//********METDOS POST********CREAR


// Esta ruta maneja la creación de productos mediante una solicitud POST.

app.post('/products', async (req, res) => {
    // req.body: Permite recibir información enviada desde el cliente, similar al contenido de un formulario.

    try {
        // Paso 1: Se extrae la información del cuerpo de la solicitud, que se espera contenga los datos del producto a crear.
        let product = req.body;

        // Paso 2: Se llama a ProductManager para agregar el producto a la base de datos y obtener un mensaje de confirmación.
        const mensaje = await productManager.addProduct(product);

        // Paso 3: Si el producto se crea con éxito, se devuelve un mensaje de éxito con el código de estado 200 (OK).
        if (mensaje == "Creado con éxito") {
            res.status(200).send(mensaje);
        } else {
            // Paso 4: Si no se proporcionaron todas las propiedades necesarias para crear el producto, se devuelve un mensaje de error 400 (Bad Request).
            // Esto indica un error del cliente al intentar crear un producto con un ID existente o faltan datos.
            res.status(400).send(mensaje);
        }

    } catch (e) {
        // Paso 5: Si ocurre algún error durante el proceso de creación del producto, se maneja aquí y se devuelve un mensaje de error 500 (Internal Server Error).
        res.status(500).send(`Error interno del servidor al consultar producto: ${e}`);
    }

})


//********METDOS PUT******ACTUALIZAR

// Esta ruta maneja la actualización de productos mediante una solicitud PUT.
// Verifica en ProductManager el método updateProducts.
// La solicitud debe ser de tipo PUT y debe incluir un ID de producto válido y los datos actualizados del producto.
app.put('/products/:pid', async (req, res) => {

    try {
        // Paso 1: Se consulta el ID del producto desde los parámetros de la solicitud. Se convierte a cadena si es necesario.
        const PRODUCTID = req.params.pid;

        // Paso 2: Se obtienen los datos actualizados del producto desde el cuerpo de la solicitud.
        let updateProduct = req.body;

        // Paso 3: Se llama a ProductManager para actualizar el producto en la base de datos y obtener un mensaje de confirmación.
        const mensaje = await productManager.updateProduct(PRODUCTID, updateProduct);

        // Paso 4: Si la actualización del producto es exitosa, se devuelve un mensaje de éxito con el código de estado 200 (OK).
        if (mensaje == 'Actualización satisfactoria') {
            res.status(200).send(mensaje);
        } else {
            // Paso 5: Si el ID del producto proporcionado no existe en la base de datos, se devuelve un mensaje de error 404 (Not Found).
            // Esto indica un error del cliente al intentar actualizar un producto con un ID inexistente.
            res.status(404).send(mensaje);
        }

    } catch (e) {
        // Paso 6: Si ocurre algún error durante el proceso de actualización del producto, se maneja aquí y se devuelve un mensaje de error 500 (Internal Server Error).
        res.status(500).send(`Error interno del servidor al actualizar producto: ${e}`);
    }

})


//********METDOS DELETE*******BORRAR

// Esta ruta maneja la eliminación de productos mediante una solicitud DELETE.
// Se refiere a la función deleteProduct en ProductsManager.js para la lógica de eliminación.
app.delete('/products/:pid', async (req, res) => {

    try {
        // Paso 1: Se consulta el ID del producto desde los parámetros de la solicitud. Se convierte a cadena si es necesario.
        const PRODUCTID = req.params.pid;

        // Paso 2: No se consultan datos adicionales del cuerpo de la solicitud ya que la eliminación se realiza solo con el ID del producto.

        // Paso 3: Se llama a ProductManager para eliminar el producto de la base de datos y obtener un mensaje de confirmación.
        const mensaje = await productManager.deleteProduct(PRODUCTID);

        if (mensaje === 'Producto Eliminado') {
            // Paso 4: Si la eliminación del producto es exitosa, se devuelve un mensaje de éxito con el código de estado 200 (OK).
            res.status(200).send(mensaje);

        } else {
            // Paso 5: Si el ID del producto proporcionado no existe en la base de datos, se devuelve un mensaje de error 404 (Not Found).
            // Esto indica un error del cliente al intentar eliminar un producto con un ID inexistente.
            res.status(404).send(mensaje);
        }

    } catch (e) {
        // Paso 6: Si ocurre algún error durante el proceso de eliminación del producto, se maneja aquí y se devuelve un mensaje de error 500 (Internal Server Error).
        res.status(500).send(`Error interno del servidor al eliminar producto: ${e}`);
    }

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
