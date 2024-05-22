import { Router } from "express";
//import passport from "passport";
import { generateRandomProducts } from "../controllers/productController.js";
import { generateRandomUsers } from "../controllers/userController.js";


//TRAIGO TODOS LOS METODOS QUE ESTABA EN app.js y reemplazo app x productsRouter
const mockRouter = Router();



// inicio OBTENER PRODUCTO RANDOM .............

mockRouter.get('/mockingproducts', generateRandomProducts)

// fin OBTENER PRODUCTO RANDOM .............




// inicio OBTENER USUARIOS RANDOM  .............

mockRouter.get('/mockingusers', generateRandomUsers)

// fin OBTENER USUARIOS RANDOM  .............


export default mockRouter

