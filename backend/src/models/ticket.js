// Importa los objetos 'Schema' y 'model' desde el paquete 'mongoose'
import { Schema, model } from 'mongoose';


//ESTE ES EL TICKET QUE LE VOY A ENVIAR A MI CLIENTE


// Define un nuevo esquema de datos para un ticket utilizando el constructor Schema
const ticketSchema = new Schema({
    // Define el campo 'code' como tipo String y obligatorio
    code: {
        type: String,
        required: true
    },
    // Define el campo 'purchase_datetime' como tipo Date, con un valor predeterminado de la fecha y hora actual de la compra
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    // Define el campo 'amount' como tipo Number y obligatorio
    amount: {
        type: Number,
        required: true
    },
    // Define el campo 'purchaser' como tipo String y obligatorio
    //Aquí puedo trabajar de 2 formas: con el email o puedo hacer una referencia del id. Como el email es único es más sencillo.
    purchaser: {
        type: String,
        required: true
    },
    // Define el campo 'products' como un array de ObjectIds referenciando el modelo 'products'
    //Detalle de compra que se mostrará en el ticket de compra
    products: [
        {
            type: Schema.Types.ObjectId,
            //al estar referenciados los productos no se van a poder eliminar
            ref: 'products'
        }
    ]
});

// Crea un modelo de MongoDB llamado 'ticket' utilizando el esquema definido anteriormente
const ticketModel = model('ticket', ticketSchema);

// Exporta el modelo 'ticketModel' para su uso en otros archivos
export default ticketModel;
