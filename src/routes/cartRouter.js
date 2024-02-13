// Importa la clase Router desde el módulo 'express'
import { Router } from "express";
// Importa la clase CartManager desde el módulo correspondiente
import { CartManager } from '../config/CartManager.js';


// Se crea una instancia de ProductManager para manejar la gestión de productos.
const cartManager = new CartManager('./src/data/cart.json');
// Se crea una nueva instancia de Router para manejar las rutas relacionadas con el carrito.
let cartRouter = Router()



// Define una ruta para obtener el carrito actual.
cartRouter.get('/', async (req, res) => {
    try {
        // Obtiene el carrito actual utilizando el método getCart de la instancia de CartManager.
        const cart = await cartManager.getCart()
        // Devuelve el carrito en el cuerpo de la respuesta con un código de estado 200 (OK).
        res.status(200).send(cart)
    } catch (error) {
        // Si ocurre un error al obtener el carrito, devuelve un mensaje de error con un código de estado 500 (Error interno del servidor).
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`)
    }
})
// Define una ruta para agregar un producto al carrito.
cartRouter.post('/:pid', async (req, res) => {
    // Obtiene el ID del producto y la cantidad proporcionada del cuerpo de la solicitud.
    try {
        //consulto parametros
        const productId = req.params.pid
        //body: consulto cantidad
        const { quantity } = req.body
        // Agrega el producto al carrito utilizando el método addProductByCart de la instancia de CartManager.
        const mensaje = await cartManager.addProductByCart(productId, quantity)
        //devuelve mensaje indicando que el producto se ha agregado correctamente con un código de estado 200 (OK).
        res.status(200).send(mensaje)
    } catch (error) {
        // Si ocurre un error al agregar el producto al carrito, devuelve un mensaje de error con un código de estado 500 (Error interno del servidor).
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
})
// Exporta el router cartRouter para su uso en otras partes de la aplicación.
export default cartRouter