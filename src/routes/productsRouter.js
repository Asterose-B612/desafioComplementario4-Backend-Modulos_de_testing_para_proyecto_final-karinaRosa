import { Router } from "express";
import productModel from "../models/product.js";


const productsRouter = Router();

//TRAIGO TODOS LOS METODOS QUE ESTABA EN app.js y reemplazo app x productsRouter



//********METDOS GET***************


// Esta ruta maneja las solicitudes GET a '/products'.
// Recibe opcionalmente el parámetro 'limit' desde la URL para limitar la cantidad de productos devueltos.
productsRouter.get('/', async (req, res) => {
    try {
        // Paso 1: Obtiene el parámetro 'limit' de la consulta HTTP.
        const { limit } = req.query;

        // Paso 2:Devuelve todos los productos. Modifiqué productManager.getProducts();  x productModel.find()
        //
        //El método .lean() en Mongoose simplifica los resultados de una consulta a objetos JavaScript básicos, útiles para operaciones de lectura eficientes.
        const PRODS = await productModel.find().lean()


        // Paso 3: Verifica si el parámetro 'limit' está presente en la consulta HTTP.
        let LIMITE = parseInt(limit);
        // Paso 5: Verifica si el valor del parámetro 'limit' es un número válido y mayor o igual que cero.
        if (!isNaN(LIMITE) && LIMITE >= 0) {
            // Paso 6: Si el límite es válido, limita el número de productos a mostrar.
            const prodsLimit = PRODS.slice(0, LIMITE);
            console.log(PRODS)
            console.log(prodsLimit)
            // Paso 7: Devuelve una respuesta con el código de estado 200 (OK) y los productos limitados.
            res.status(200).render('templates/home', {
                //mostrame estos productos bajo lo que seria un condicional. Por eso se usa :
                //cuando renderizo estos productos envio este condicional true, y envio este condicional de productos.
                mostrarProductos: true,
                productos: prodsLimit,
                css: 'home.css'
            });
        } else {
            // Si el límite no es válido, muestra todos los productos sin limitar.
            const prodsLimit = PRODS;
            res.status(200).render('templates/home', {
                mostrarProductos: true,
                productos: prodsLimit,
                css: 'home.css'
            });
        }



    } catch (error) {
        res.status(500).render('templates/error', {
            error: error,
        })
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