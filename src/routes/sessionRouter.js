import { Router } from "express";
import { userModel } from "../models/user.js";

// Crea un enrutador en Express.js para manejar las solicitudes relacionadas con las operaciones de usuario en la aplicación web.
const sessionRouter = Router();

// Este endpoint maneja la solicitud de inicio de sesión de un usuario.
// Espera recibir una solicitud POST con los campos 'email' y 'password' en el cuerpo.
sessionRouter.post('/login', async (req, res) => {
    // Extraigo el email y la contraseña de la solicitud.
    const { email, password } = req.body;
    try {
        // Consulto si el usuario existe
        // Busco un usuario en la base de datos que coincida con el email proporcionado.
        // lean() como JSON se utiliza para obtener un objeto plano en lugar de un documento de Mongoose.
        const user = await userModel.findOne({ email: email }).lean();
        // Si el usuario existe y la contraseña coincide, se inicia sesión correctamente.
        if (user && password === user.password) {
            // Se asigna el correo electrónico del usuario que ha iniciado sesión a la propiedad 'email' de la sesión actual.
            req.session.email = email;
            // Si el usuario tiene el rol de "Admin", se establece la sesión de administrador.
            if (user.rol === "Admin") {
                // Se establece la propiedad 'admin' en la sesión actual como verdadera para indicar que el usuario que ha iniciado sesión es un administrador.
                req.session.admin = true;
                res.status(200).send("Usuario Admin logueado correctamente");
            } else {
                // Si no es un administrador, se responde con un mensaje de éxito.
                res.status(200).send("Usuario logueado correctamente");
            }
        } else {
            // Si el usuario o la contraseña no son válidos, se devuelve un código de estado 401 (No autorizado).
            res.status(401).send("Usuario o contraseña no válidos");
        }
    } catch (error) {
        // Si hay un error en el proceso de inicio de sesión, se devuelve un código de estado 500 (Error interno del servidor).
        res.status(500).send("Error al loguear usuario", error);
    }
});

export default sessionRouter;
