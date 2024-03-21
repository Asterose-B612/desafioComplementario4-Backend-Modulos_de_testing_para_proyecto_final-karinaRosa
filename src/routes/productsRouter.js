import { Router } from "express";
import productModel from "../models/product.js";


const productsRouter = Router();

//TRAIGO TODOS LOS METODOS QUE ESTABA EN app.js y reemplazo app x productsRouter



//********METDOS GET***************


// Esta ruta maneja las solicitudes GET a '/products'.
// Recibe opcionalmente los parámetros 'limit', 'page', 'filter' y 'ord' desde la URL para limitar la cantidad de productos devueltos, paginar los resultados, filtrar por estado o categoría, y ordenar por precio.
productsRouter.get('/', async (req, res) => {
    try {
        // Paso 1: Obtiene los parámetros 'limit', 'page', 'filter' y 'sort' de la consulta HTTP.
        const { limit = 10, page = 1, filter, sort } = req.query;

        // Paso 2: Construye el objeto de consulta para la base de datos, utilizando el filtro correspondiente.
        const query = filter ? (filter === 'true' || filter === 'false' ? { status: filter } : { category: filter }) : {};

        // Paso 3: Construye el objeto de consulta para el método de ordenamiento, utilizando 'price' como clave y 'sort' como dirección de ordenamiento.
        const sortQuery = sort ? { price: sort === 'asc' ? 1 : -1 } : {};

        // Paso 4: Realiza la consulta a la base de datos, aplicando el filtro, paginación y ordenamiento.
        const options = { limit: parseInt(limit), page: parseInt(page), sort: sortQuery };
        const products = await productModel.paginate(query, options);

        // Paso 5: Calcula si hay páginas previas y siguientes.
        const prevPage = products.prevPage ? parseInt(page) - 1 : null;
        const nextPage = products.nextPage ? parseInt(page) + 1 : null;

        // Paso 6: Envía la respuesta con el formato requerido.
        res.status(200).json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: parseInt(page),
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,           
        });
    } catch (error) {
        res.status(500).render('templates/error', {
            error: error,
        });
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
        const PROD = await productModel.findById(PRODUCTID)

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

        // Paso 2: Llamo al modelo. Al crear un nuevo prod.
        //reemplacé productManager.addProduct x
        const mensaje = await productModel.create(product);

        // Paso 3: Si el producto se crea con éxito, mensaje de estado 201. 201 porqu fue creado.  
        res.status(201).send(mensaje)

    } catch (error) {
        // Paso 5: Si ocurre algún error durante el proceso de creación del producto, se maneja aquí y se devuelve un mensaje de error 500 (Internal Server Error).
        res.status(500).send(`Error interno del servidor al consultar producto: ${error}`);
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
        const prod = await productModel.findByIdAndUpdate(PRODUCTID, updateProduct);

        // Paso 4: Si la actualización del producto es exitosa, se devuelve un mensaje de éxito con el código de estado 200 (OK).
        res.status(200).send(prod);
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
        const mensaje = await productModel.findByIdAndDelete(PRODUCTID);
        // Paso 4: Si la eliminación del producto es exitosa, se devuelve un mensaje de éxito con el código de estado 200 (OK).
        res.status(200).send(mensaje);

    } catch (e) {
        // Paso 6: Si ocurre algún error durante el proceso de eliminación del producto, se maneja aquí y se devuelve un mensaje de error 500 (Internal Server Error).
        res.status(500).send(`Error interno del servidor al eliminar producto: ${e}`);
    }

})

//exporto de este archivo para ser importado en app.js

export default productsRouter