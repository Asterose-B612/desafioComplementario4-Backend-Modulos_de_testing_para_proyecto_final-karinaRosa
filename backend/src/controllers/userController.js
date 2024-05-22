import { userModel } from "../models/user.js";
import { createRandomUser } from "../mockings.js/mockingUsers.js";

export const getUsers = async (req, res) => {
     //en try consulto los usuarios
 try {
    //en userModel tengo todos los metodos para consultar, eliminar,etc  
    //uso metodo find para traer todos los usuarios de mi aplicacion
    const users = await userModel.find()
    res.status(200).send(users)

} catch (e) {
    res.status(500).send("Error al consultar usuarios", e)
}//capturo error con catch 

}




// inicio GENERAR PRODUCTOS ALEATORIOS .........................

export const generateRandomUsers = () => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push(createRandomUser());
    }
    return products;
};

// inicio GENERAR PRODUCTOS ALEATORIOS .........................
