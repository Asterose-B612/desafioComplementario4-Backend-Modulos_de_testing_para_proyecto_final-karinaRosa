// Importa la clase Router desde el módulo 'express'
import { Router } from "express";
import cartModel from "../models/cart.js";

// Se crea una nueva instancia de Router para manejar las rutas relacionadas con el carrito.
const cartRouter = Router()


//*******CARRITO VACÍO******************

// Nuevo endpoint para crear un carrito vacío
cartRouter.post('/', async (req, res) => {
    try {
        // Crear un carrito vacío inicializando 'products' como un array vacío
        const mensaje = await cartModel.create({ products: [] })
        // Enviar respuesta con el carrito creado y código 201 (Created)
        res.status(201).send(mensaje)
    } catch (error) {
        // Manejar errores y enviar respuesta con código 500 (Internal Server Error)
        res.status(500).send(`Error interno del servidor al crear carrito: ${error}`)
    }
})


//*******OBTENER UN CARRITO POR SU ID******************

// Nuevo endpoint para obtener un carrito por su ID
cartRouter.get('/:cid', async (req, res) => {
    try {
        // Obtener el ID del carrito de los parámetros de la URL
        const cartId = req.params.cid
        // Buscar el carrito por su ID        
        // Enviar respuesta con el carrito encontrado y código 200 (OK)
        const cart = await cartModel.findOne({ _id: cartId })
        res.status(200).send(cart)
    } catch (error) {
        // Si ocurre un error al obtener el carrito, devuelve un mensaje de error con un código de estado 500 (Error interno del servidor).
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`)
    }
})


//*******AGREGAR O ACTUALIZAR LA CANT. DE UN PRODUCTO EN EL CARRITO****************

// Nuevo endpoint para agregar o actualizar la cantidad de un producto en el carrito
cartRouter.post('/:cid/:pid', async (req, res) => {
    // Obtiene el ID del producto y la cantidad proporcionada del cuerpo de la solicitud.
    try {
        // Obtener el ID del carrito y del producto de los parámetros de la URL
        const cartId = req.params.cid
        const productId = req.params.pid
        //// Obtener la cantidad del producto del cuerpo de la solicitud
        const { quantity } = req.body
        // Buscar el carrito por su ID
        const cart = await cartModel.findById(cartId)

        // Buscar el índice del producto en el array de productos del carrito
        const indice = cart.products.findIndex(product => product.id_prod == productId)
        //Consulta un producto cuyo id sea igual a product Id
        if (indice != -1) {
            // Si el producto ya existe en el carrito, actualizar su cantidad
            cart.products[indice].quantity = quantity
            //RECORDAR: cart sería EL OBJETO EN SU TOTALIDAD
            //cart.products→ sería EL ARRAY DE MIS ELEMENTOS
        } else {
            // Si el producto no existe en el carrito, agregarlo al array de productos
            cart.products.push({ id_prod: productId, quantity: quantity })
        }//tanto si lo agrego o lo modifico lo tengo que actualizar

        // ......Actualizar el carrito en la base de datos.........

        const mensaje = await cartModel.findByIdAndUpdate(cartId, cart)
        // Enviar respuesta con el mensaje de confirmación y código 200 (OK)).
        res.status(200).send(mensaje)
    } catch (error) {
        // Manejar errores y enviar respuesta con código 500 (Internal Server Error)
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
})





//*****ELIMINAR DEL CARRITO EL PRODUCTO SELECCIONADO, BUSCAR Y ACTUALIZAR CARRITO EN LA BASE DE DATOS****** */


// Endpoint DELETE en el router de carritos que escucha en la URL, para eliminar un producto específico de un carrito, buscar y actualizar los datos del carrito en la base de datos.
cartRouter.delete('/:cid/products/:pid', async (req, res) => {

    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        // Encuentra el carrito por su ID
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Encuentra el índice del producto en el arreglo de productos del carrito
        const productIndex = cart.products.findIndex(product => product.id_prod.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        // Elimina el producto del arreglo de productos del carrito
        cart.products.splice(productIndex, 1);

        // Guarda los cambios en el carrito
        await cart.save();

        res.status(200).json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        // Manejar errores y enviar respuesta con código 500 (Internal Server Error)
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }

});


//LA SIGUIENTE RUTA ESTA DESTINADA PARA HACER PRÁCTICAS, PARA PODER MODIFICAR MI CARRITO HACIENDO PEQUEÑOS TEST SIN TENER QUE ESTAR VIENDO ELEMENTO A ELEMENTO, UNO X UNO. DIRECTAMENTE ENVÍO UN ARRAY DE OBJETOS EN EL BODY A MODIFICAR Y LISTO.
//NO VA A SER USADA EN PRODUCCION, SÍ EN TESTING
//     ↓


//*******ACTUALIZAR EL CARRITO CON UN ARREGLO DE PRODUCTOS ****************

//Endpoint PUT para actualizar el carrito con un arreglo de productos.
//Esta ruta debe aceptar un parámetro en la URL :cid para el ID del carrito y recibir el arreglo de productos en el cuerpo de la solicitud.
cartRouter.put('/:cid', async (req, res) => {

    try {
        // Obtener el ID del carrito de la URL
        const cartId = req.params.cid;
        // Obtener el arreglo de productos del cuerpo de la solicitud
        const newProducts = req.body.products;

        // Actualizar el carrito con el nuevo arreglo de productos
        const updatedCart = await cartModel.findByIdAndUpdate(cartId, { products: newProducts });

        // Enviar el carrito actualizado como respuesta
        res.status(200).send(updatedCart);

    } catch (error) {
        // Manejar cualquier error y enviar una respuesta con el código de estado 500 (Error interno del servidor)
        res.status(500).send(`Error interno del servidor al actualizar carrito: ${error}`);
    }

})



//****************ACTUALIZAR SOLO LA CANTIDAD DE EJEMPLARES DEL PRODUCTO POR CUALQUIER CANTIDAD PASADA DESDE REQ.BODY********************

// Endpoint PUT para actualizar la cantidad de ejemplares de un producto en el carrito
cartRouter.put('/:cid/products/:pid', async (req, res) => {

    try {
        // Obtener el ID del carrito de la URL con req.params
        const cartId = req.params.cid;
        // Obtener el ID del producto de la URL con req.params
        const productId = req.params.pid;
        // Obtener la nueva cantidad del cuerpo de la solicitud
        const { quantity } = req.body;


        // Utiliza el método findOneAndUpdate para buscar y actualizar un documento en la colección de carritos
        const updatedCart = await cartModel.findOneAndUpdate(
            // LacCondición de la búsqueda: busca un carrito con el ID proporcionado y que contenga un producto con el ID igual a productId  
            { _id: cartId, "products.id_prod": productId },
            // Objeto de actualización: establece la nueva cantidad del producto en el carrito con el valor proporcionado en quantity.Uso del operador Set en Mongo DB para cambiar el valor de un campo existente o agregar un campo si no existe previamente en el documento.
            //products.$.quantity:especificar el campo que queremos actualizar. products.$.quantity indica que queremos actualizar el campo quantity dentro de un objeto products que coincide con la condición de búsqueda. quantity: Es el nuevo valor que queremos establecer en el campo quantity
            //$set se utiliza aquí para actualizar el campo quantity del producto encontrado en el carrito con el nuevo valor proporcionado en quantity
            { $set: { "products.$.quantity": quantity } },
            // Opciones de configuración:
            // Devuelve el documento actualizado después de la actualización
            { new: true }
        );

        // Envio el carrito actualizado como respuesta
        res.status(200).send(updatedCart);

    } catch (error) {
        // Manejar cualquier error y enviar una respuesta con el código de estado 500 (Error interno del servidor)
        res.status(500).send(`Error interno del servidor al actualizar carrito: ${error}`);
    }

})



//*****ELIMINAR TODOS LOS PRODUCTOS DEL CARRITO****

// Endpoint DELETE para eliminar todos los productos del carrito
cartRouter.delete('/:cid', async (req, res) => {
    try {
        // Obtener el ID del carrito de la URL con req.params
        const cartId = req.params.cid;

        // Actualizar el carrito para eliminar todos los productos
        //findByIdAndUpdate para buscar el carrito por su ID y actualizarlo con un array vacío en el campo products, eliminando así todos los productos del carrito.
        const updatedCart = await cartModel.findByIdAndUpdate(cartId, { products: [] });

        // Si todo ok, envío el carrito actualizado como respuesta con el código de estado 200 
        res.status(200).send(updatedCart);

    } catch (error) {
        // Manejar cualquier error y enviar una respuesta con el código de estado 500 (Error interno del servidor)
        res.status(500).send(`Error interno del servidor al eliminar todos los productos del carrito: ${error}`);
    }
});


//********VISUALIZAR UN CARRITO ESPECIFICO*****
// Definir una ruta para visualizar un carrito específico
cartRouter.get('/:cid', async (req, res) => {

    try {
        // Obtiene el ID del carrito de los parámetros de la URL con req,params
        const cartId = req.params.cid;
        // Busca el carrito en la BD por su ID, y utiliza populate para obtener los detalles de los productos asociados al carrito
        const cart = await cartModel.findById(cartId).populate('products.id_prod');
        // Renderiza la vista 'cart.hbs' con los datos del carrito
        res.render('templates/cart', { cart });
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta con el código de estado 500 (Error interno del servidor)
        res.status(500).send(`Error interno del servidor al obtener el carrito específico: ${error}`);
    }
});


// Exporta el router cartRouter para su uso en otras partes de la aplicación.
export default cartRouter