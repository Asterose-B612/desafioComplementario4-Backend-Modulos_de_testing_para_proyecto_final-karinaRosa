/*Desafío N°4
Crear una vista llamada homehandlebars con todos los productos agregados hasta el momento.
Formato: Link al repositorio de Github con el proyecto completo, sin la carpeta de Node_modules.
*/


//*******IMPORTACIONES******************

// Importa el módulo Express para crear el servidor
import express from 'express'
import mongoose from 'mongoose'
import messageModel from './models/messages.js'
import indexRouter from './routes/indexRouter.js'
import { __dirname } from './path.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io' //llaves es una dependencia

//console.log(__dirname)

//*******CONFIGURACIONES O DECLARACIONES******************

// Se crea una instancia de Express para configurar el servidor.
const app = express();
// Se define el puerto en el que el servidor estará escuchando.
const PORT = 8000


//----SERVER---------
// Se define el servidor utilizando la variable 'app'.
// El servidor escucha en el puerto definido por la variable 'PORT'.
// Cuando el servidor está activo, se ejecuta una función anónima para mostrar un mensaje de estado en la consola.
const SERVER = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
// Muestra un mensaje en la consola indicando que el servidor está activo y escuchando en el puerto especificado.

//declaro un nuevo servidor de sockets.io
const io = new Server(SERVER)

//----CONECTION DB---------
//contraseña que yo defino
mongoose.connect("mongodb+srv://azul:rosa@cluster0.0wxpkun.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//cuando esta conexion me devuelva un valor voy a mostrar este mensaje
.then(() => console.log ("DB is connected"))
//si hay error muestro el error
.catch(e => console.log (e))


//*******MIDDLEWARES******************

//el servidor podrá recibir json al momento de la petición
app.use(express.json())
//permite que se pueda mandar informacion tambien desde la URL
app.use(express.urlencoded({ extended: true }))



//......CON ESTO CONFIGURO HANDLEBARS.....

app.engine('handlebars', engine())
//voy a trabajar con handlebars, esto implementa lo que me devuelve mi dependencia

app.set('view engine', 'handlebars')
//set es para setear un valor
//para las vistas de mi aplicacion voy a implementar handlebars

//CON ESTO INDICO DONDE SE ESTA UTILIZANDO
app.set('views', __dirname + '/views')
//las vistas de mi aplicacion se encuentran en __dirname es mi path →seria la carpeta src y lo concateno con la carpeta views

//establece que el middleware indexRouter manejará las solicitudes en la ruta raíz de la aplicación.
app.use('/', indexRouter)


//...........SOCKET.IO..................

// Cuando se establece una conexión con Socket.io, se ejecuta esta función.
// Esta función recibe un socket que representa la conexión con el cliente.
io.on('connection', (socket) => {
  // Se imprime un mensaje en la consola del servidor para indicar la conexión exitosa.
  console.log("Conexión establecida con Socket.io")

  // Cuando el cliente envía un mensaje de 'mensaje', se ejecuta esta función.
  socket.on('mensaje', async (mensaje) => {
    // Se intenta almacenar el mensaje en la base de datos.
    try {
      // Se utiliza un modelo de mensaje (messageModel) para crear un nuevo mensaje en la base de datos.
      await messageModel.create(mensaje)
      // Busca todos los mensajes en la base de datos utilizando el modelo de mensaje (messageModel) y los almacena en la variable 'mensajes'
      const mensajes = await messageModel.find()
      // Se emite el evento 'mensajeLogs' a todos los clientes conectados, enviando el arreglo actualizado de mensajes.
      io.emit('mensajeLogs', mensajes)
    } catch (e) {
      // Si ocurre un error al almacenar el mensaje, se emite el error a todos los clientes conectados.
      io.emit('mensajeLogs', e)
    }
  })
})






