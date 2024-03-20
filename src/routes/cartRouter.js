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



//*****ELIMINAR DEL CARRITO EL PRODUCTO SELECCIONADO****** */

// Endpoint DELETE en el router de carritos que escucha en la URL, para eliminar un producto específico de un carrito
cartRouter.delete('/:cid/products/:pid', async (req, res) => {

    try {
        // Obtener el ID del carrito de la URL usando req.params
        const cartId = req.params.cid;
        // Obtener el ID del producto de la URL usando req.params
        const productId = req.params.pid;

        // Actualizar el carrito eliminando el producto con el ID proporcionado
        //uso metodo de Mongoose findByIdAndUpdate para BUSCAR UN DOCUMENTO X SU ID Y LO ACTUALIZA
        const updatedCart = await cartModel.findByIdAndUpdate(cartId, {
           //método $pull de MongoDB:  para eliminar el producto con el ID especificado del array de productos del carrito.
            $pull: { products: { id_prod: productId } }
        });

        // Si todo ok, se envía el carrito actualizado como respuesta con el código de estado 200
        res.status(200).send(updatedCart);

    } catch (error) {
        // Manejar errores y enviar respuesta con código 500 (Internal Server Error)
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }

});






// Exporta el router cartRouter para su uso en otras partes de la aplicación.
export default cartRouter