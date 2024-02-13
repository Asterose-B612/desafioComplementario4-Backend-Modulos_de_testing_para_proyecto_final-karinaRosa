import { Router } from "express";
// Importa la clase ProductManager desde el módulo correspondiente
import { ProductManager } from '../config/ProductManager.js';


// Se crea una instancia de ProductManager para manejar la gestión de productos.
const productManager = new ProductManager('./src/data/products.json');

let productsRouter = Router()

//TRAIGO TODOS LOS METODOS QUE ESTABA EN app.js y reemplazo app x productsRouter

//********METDOS GET***************


// Esta ruta maneja las solicitudes GET a '/products'.
// Recibe opcionalmente el parámetro 'limit' desde la URL para limitar la cantidad de productos devueltos.
productsRouter.get('/', async (req, res) => {
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

productsRouter.get('/:pid', async (req, res) => {

    try {
        // Paso 1: Consulta el parámetro de la solicitud para obtener el identificador del producto.
        const PRODUCTID = req.params.pid
        // Paso 2: Consulta en la base de datos el producto con el ID proporcionado.
        /* Nota: Todo dato consultado desde un parámetro es de tipo string. Si el ID es numérico, se necesita convertirlo. */
        // Llama a ProductManager para devolver el producto con el ID solicitado.
        const PROD = await productManager.getProductById(PRODUCTID)

        // Paso 3: Si producto existe, lo devuelve. Sino, devuelve un mensaje de error 404 al cliente por solicitar un ID que no existe.
    
            if (PROD) {

                res.status(200).send(PROD)
                // Devuelve el producto con el código de estado 200 (OK).

            } else {
                res.status(404).send("Producto no encontrado")
                // Devuelve un mensaje de error 404 (Not Found).
            }
       

    } catch (e) {
        res.status(500).send(`Error interno del servidor al consultar producto: ${e}`)
        // Paso 4: Si ocurre algún error durante la consulta del producto, se maneja aquí y se devuelve un mensaje de error 500 (Internal Server Error).
    }

})


//********METDOS POST********CREAR


// Esta ruta maneja la creación de productos mediante una solicitud POST.

productsRouter.post('/', async (req, res) => {
    // req.body: Permite recibir información enviada desde el cliente, similar al contenido de un formulario.

    try {
        // Paso 1: Se extrae la información del cuerpo de la solicitud, que se espera contenga los datos del producto a crear.
        let product = req.body;
        console.log(product)
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
productsRouter.put('/:pid', async (req, res) => {

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
productsRouter.delete('/:pid', async (req, res) => {

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

//exporto de este archivo para ser importado en app.js

export default productsRouter