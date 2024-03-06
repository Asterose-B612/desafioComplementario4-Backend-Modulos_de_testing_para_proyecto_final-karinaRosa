import { Schema, model } from "mongoose";


//voy a definir un userSchema que se va a componer de un objeto llamado Schema
//o sea voy a generar el Schema de lo que serian mis usuarios, los datos que van a componer mis usuarios

const userSchema = new Schema({ 
    //datos del usuario: atributos y tipode datos, se van a definirse en mi modelo
    name: String,
    surname: String,
    password: String,
    edad: Number,
/*En la BDD no existe el tipo email, sí en los formularios.
EL EMAIL ES ÚNICO,todas las aplicaciones sociales y Ecommerce tiene en común. NO PUEDE HABER 2 EMAILS= EN MI APLICACION. Lo puedo restringir desde el BACK, Front y BBD*/

    email: {
        /*defino el email de tipo String y único. Agrego la restriccion aqui. Si ingresan 2 email = ERROR.
        La restriccion se da desde el Front: ej tiene que tener un @, etc. Para la BDD ES UN STRING.
        Ya para este punto el email deberia estar validado*/
        type: String,
        unique: true
    }  

})

//exporto una constante que va a ser igual a este modelo de nombre users y el siguiente esquema: userSchema
export const userModel = model ("users", userSchema)