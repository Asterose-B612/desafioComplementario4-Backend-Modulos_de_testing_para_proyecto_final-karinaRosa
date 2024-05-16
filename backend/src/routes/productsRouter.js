import { Router } from "express";
import passport from "passport";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";


//TRAIGO TODOS LOS METODOS QUE ESTABA EN app.js y reemplazo app x productsRouter
const productsRouter = Router();




//********METDOS GET: limit, page, sort asc/desc, query (filter)***************


//Pruebas en Postman:http://localhost:8000/api/products?limit=2&page=1&sort=asc&filter=Smartphone




// inicio OBTENER PRODUCTO  .............

productsRouter.get('/', getProducts)

// fin OBTENER PRODUCTO  .............





// inicio OBTENER PRODUCTO  .............

productsRouter.get('/:pid', getProduct)

// fin OBTENER PRODUCTO  .............






// inicio CREAR PRODUCTO .........................

productsRouter.post('/', passport.authenticate('jwt', { session: false }), createProduct)


// fin CREAR PRODUCTO .........................






// inicio ACTUALIZAR PRODUCTO EXISTENTE..........................................

productsRouter.put('/:pid', passport.authenticate('jwt', { session: false }), updateProduct)

// fin ACTUALIZAR PRODUCTO EXISTENTE..........................................







// inicio ElIMINAR PRODUCTO EXISTENTE x su id .........................

productsRouter.delete('/:pid', passport.authenticate('jwt', { session: false }), deleteProduct)

// fin ElIMINAR PRODUCTO EXISTENTE x su id .........................

export default productsRouter
