import { Router } from "express";
//import passport from "passport";
import { generateRandomProducts } from "../controllers/productController.js";


//TRAIGO TODOS LOS METODOS QUE ESTABA EN app.js y reemplazo app x productsRouter
const mockRouter = Router();


// inicio OBTENER PRODUCTO  .............
mockRouter.get('/mockingproducts', generateRandomProducts)

// fin OBTENER PRODUCTO  .............


export default mockRouter

