import { Router } from "express";
import productModel from "../models/product.js";


const productsRouter = Router();

//TRAIGO TODOS LOS METODOS QUE ESTABA EN app.js y reemplazo app x productsRouter



//********METDOS GET***************


// Esta ruta maneja las solicitudes GET a '/products'.
// Recibe opcionalmente los parámetros 'limit', 'page', 'filter' y 'ord' desde la URL para limitar la cantidad de productos devueltos, paginar los resultados, filtrar por estado o categoría, y ordenar por precio.
productsRouter.get('/', async (req, res) => {
    try {
        //....CONSULTAS......
        // Paso 1: Obtiene los parámetros 'limit', 'page', 'filter' y 'ord' de la consulta HTTP.
        const { limit, page, filter, ord } = req.query;
        //declaro la variable metFilter para determinar si se filtrará por estado o categoría.
        let metFilter;
        // Asigna el valor de 'page' enviado en la consulta, sino se especifica  por defecto consulto por 1.

        const PAG = page !== undefined ? page : 1;
        // Asigno el valor de 'limit' enviado en la consulta, o por defecto 10 si no se especifica.
        const LIM = limit !== undefined ? limit : 10;




        //Condicional: para determinar si se filtrará por estado o categoría.
        // Si 'filter' es un booleano, se filtra por estado ('status'), de lo contrario se filtra por categoría ('category').
        if (filter === "true" || filter === "false") {
            metFilter = "status"
        } else {
            if (filter !== undefined)
                metFilter = "category";
        }
        // Crea el objeto de consulta para la base de datos, utilizando el filtro correspondiente.
        const query = metFilter !== undefined ? { [metFilter]: filter } : {};
        // Crea el objeto de consulta para el método de ordenamiento, utilizando 'price' como clave y 'ord' como dirección de ordenamiento.
        const ordquery = ord !== undefined ? { price: ord } : {};


        console.log(query)


        // Realiza la consulta a la base de datos, aplicando el filtro, paginación y ordenamiento.
        const PRODS = await productModel.paginate(query, { limit: LIM, page: PAG, sort: ordquery });


        console.log(ordquery)


        //Si ok: código de estado 200 y los productos limitados.
        res.status(200).send(PRODS);

        // Si hay un error, responde con código de estado 500 y renderiza una plantilla de error.
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