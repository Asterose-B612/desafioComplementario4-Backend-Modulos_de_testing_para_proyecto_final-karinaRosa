import { userModel } from "../models/user.js";

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


