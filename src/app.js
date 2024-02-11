/*DESAFÍO N°3/ CONSIGNA:
Basado en el desafío N°2" Manejo de archivos".
Objetivo: Generar un servidor con express.
Con 2 Rutas:
/products →  lee ese archivo y devuelveun array de productos.Va a recibir un Query llamado limit. METODO FILTER.
/products/:id → recibir por parametro el id y devolver el producto solicitado. METODO FIND Y getProductById
TRABAJAMOS CON PROMESAS: ARCHIVOS ASINCRONICOS
EL DESAFIO ES SOLO PARA GETS ASI QUE SE DEBES TENER UN ARCHIVO CON PRODUCTOS.

EN CONSOLA: CORRER PUERTO: npm run nodemon o npm run devNode
*/


//importo modulo express para crear el servidor
import express from 'express'
// Importa la clase correcta (ProdutManager) desde el módulo correspondiente
import { ProductManager } from './config/ProductManager.js';




//hago referencia a lo q seria todo el codigo de express
const app = express()
//variable para cambios de puertos
const PORT = 8000
// Crea una instancia de ProdutManager
const productManager = new ProductManager('./src/data/products.json');


//********METDOS GET***************




//en la ruta inicial ejecitame el siguiente comando
app.get('/', (req, res) => {

    res.send("Servidor creado recientemente en Express")

})

//FUNCION ASINCRONICA PARA OBTENER TODOS LOS PRODUCTOS.Uso: metodo getProducts

app.get('/products', async (req, res) => {
    //capturo errores con try y catch
    try {
        // esta Ruta recibe 1 límite opcional de cant.de prods.
        // IF se proporciona → limita, ELSE → envía todos.
        //CONSULTAR EL ARRAY DE PRODS QUE TRAIGO DESDE FS:consulto mis querys, el elemento limit.
        const { limit } = req.query
        //{limit} xq pueden ir varios elementos a consultar
        //consulto mi productManager, me return prods
        const PRODS = await productManager.getProducts()
        const LIMITE = parseInt(limit)

// Verifica si el valor de 'LIMITE' no es un número o es menor o igual a cero.
        if (isNaN(LIMITE) || LIMITE <= 0) {
            return res.status(400).send("ERROR al consultar productos, ingrese un número válido para 'limit'");
        }


        //si cliente no proporciona 1 limite se muestran todos los productos
        if (limit === undefined) {
            return res.send(PRODS)
        }else {
              //devuelve una copia del array sin modificar su valor
            //valor inicial→0, al fin→ limit
            const prodsLimit = PRODS.slice(0, LIMITE)
            //lo devuelve y resondo con 200: exitoso
            res.status(200).send(prodsLimit)
        }                     

        //e=error
    } catch (e) {
        //res.status devuelve un n° de http
        res.status(500).send(`Error interno del servidor al consultar productos: ${e}`)
    }

})



//consulta en ruta productos. pid no es valor fijo.pid creado x crypto
app.get('/products/:pid', async (req, res) => {

    try {
        //consulto por parametro la solicitud
        const PRODUCTID = req.params.pid
        //consulto por id de producto
        /*todo dato q se consulta desde un parametro es un string. Si tenemos un id tipo numerico hay que parsearlo*/
        const PROD = await productManager.getProductById(PRODUCTID)
        //llamo a ProductManager para devolver prod c/id solicitado}

        //si mi producto existe lo devuelvo sino mensaje 404:ERROR cliente por mandar un id que no existe
        if (PROD) {

            res.status(200).send(PROD)

        } else {
            res.status(404).send("Producto no encontrado")
        }

    } catch (e) {
        res.status(500).send(`Error interno del servidor al consultar producto: ${e}`)
    }

})




//********METDOS POST***************
//Metodo post en /products, todos


app.post('/products', async (req, res) => {
    //req.body: me permite enviar informacion (como en un formulario, seria el contenido de un formulario)

    try {
        //LO QUE VENGA DEL BODY VA A VENIR DE lo que voy a llamar producto
        let product = req.body       
        const mensaje = await productManager.addProduct(product)
        //llamo a ProductManager para devolver mensajes

        //si mi producto
        if (mensaje === "Creado con éxito") {
            res.status(200).send(mensaje)     
    //en el caso que no ingresaron todas las propiedades
            }else {
                res.status(400).send(mensaje)
            }  

        } catch (e) {
        res.status(500).send(`Error interno del servidor al consultar producto: ${e}`)
    }

})


//********METDOS PUT***************
//Metodo put /products/:id sí o sí, necesito un id y un nuevo producto

app.put('/products/:pid', async (req, res) => {

    try {
        //consulto ese id (string sino parsearlo)
        const PRODUCTID = req.params.pid
    
        
        const PROD = await productManager.getProductById(PRODUCTID)
        //llamo a ProductManager para devolver prod c/id solicitado}

        //si mi producto existe lo devuelvo sino mensaje 404:ERROR cliente por mandar un id que no existe
        if (PROD) {

            res.status(200).send(PROD)

        } else {
            res.status(404).send("Producto no encontrado")
        }

    } catch (e) {
        res.status(500).send(`Error interno del servidor al consultar producto: ${e}`)
    }

})






















//Defino mi servidor → app, app escucha PORT, f anonima → show message
app.listen(PORT, () => {

    console.log(`Server on port ${PORT}`)

})