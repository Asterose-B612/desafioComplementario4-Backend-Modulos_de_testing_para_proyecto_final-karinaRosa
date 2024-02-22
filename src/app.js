/*Desafío N°4
Formato: Link al repositorio de Github con el proyecto completo, sin la carpeta de Node_modules.
*/


//*******IMPORTACIONES******************

// Importa el módulo Express para crear el servidor
import express from 'express'
import productsRouter from './routes/productsRouter.js'
import cartRouter from './routes/cartRouter.js'
import upload from './utils.js'
import { __dirname } from './path.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'

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

//*******MIDDLEWARES******************

//el servidor podrá recibir json al momento de la petición
app.use(express.json())
//permite que se pueda mandar informacion tambien desde la URL
app.use(express.urlencoded({ extended: true }))
// Para poder utilizar los recursos de una carpeta de manera estática.
//SE DEFINE ANTES DE DEFINIR LAS RUTAS.
// Esta línea configura Express para servir archivos estáticos desde el directorio 'public'
// Cuando se recibe una solicitud en la ruta '/static', Express buscará y devolverá archivos estáticos desde el directorio 'public'.
// Por ejemplo, si se recibe una solicitud GET a '/static/css/style.css', Express buscará el archivo 'style.css' en el directorio 'public/css' y lo devolverá como respuesta.
app.use('/static', express.static(__dirname + '/public'));
//para poder utilizar el import de Router 2 maneras. En el metodo get en productsRouter o definirla aqui con el app.use
//para la siguiente ruta ejecutame lo que seria productsRouter
//defino la ruta products va a trabajar con productsRouter
//defino que cada uno de mis elementos va a estar en la ruta products


//CON ESTO CONFIGURO HANDLEBARS
app.engine('handlebars', engine())
//voy a trabajar con handlebars, esto implementa lo que me devuelve mi dependencia
app.set('view engine', 'handlebars')
//set es para setear un valor
//para las vistas de mi aplicacion voy a implementar handlebars

//CON ESTO INDICO DONDE SE ESTA UTILIZANDO
app.set('views', __dirname + '/views')
//las vistas de mi aplicacion se encuentran en __dirname es mi path →seria la carpeta src y lo concateno con la carpeta views



//...........SOCKET.IO..................
// Cuando se establece una conexión con Socket.io, se ejecuta esta función IO.ON. Esta conexion me devuelve un socket que seria mi listener, el cliente que esta escuchando "APRETON DE MANOS"
io.on('connection', (socket) => {
  //cuando tenga ese "apreton de manos" de distintos clientes agrego a la consola el mensaje
  console.log("Conexion con Socket.io")
  // Cuando el cliente envía un mensaje de 'movimiento', se ejecuta esta función
  socket.on('movimiento', info => {
    // Imprime en la consola del servidor la información recibida desde el cliente
    console.log(info)
  })

  // Cuando el cliente envía un mensaje de 'rendirse', se ejecuta esta función
  socket.on('rendirse', info => {
    // Imprime en la consola del servidor la información recibida desde el cliente
    console.log(info)
    // Envía un mensaje solo al cliente que ha enviado el mensaje de rendirse
    socket.emit('mensaje-jugador', "Te has rendido")
    })
   // Envía un mensaje a todos los clientes excepto al que envió el mensaje de rendirse
  socket.broadcast.emit('rendicion', "El jugador se rindio") //
})



//*******RUTAS******************


app.use('/api/products', productsRouter)
//productsRouter va a importar las rutas de todos esos elementos. Divido mi aplicacion en pequeñas partes.
//Genero ruta donde subo las imagenes. El middleware se encuentra entre la ruta y el contenido de la ruta
app.use('/api/cart', cartRouter)

//PARA LA CARGA DE IMAGENES
app.post('/upload', upload.single('product'), (req, res) => {
  try {
    console.log(req.file)
    res.status(200).send("Imagen cargada correctamente")
  } catch (e) {
    res.status(500).send("Error al cargar imagen")
  }
})

//GENERAMOS UNA VISTA PARA LA IMPLEMENTACIÓN CON HANDLEBARS.
//en la ruta static, voy a renderizar una plantilla xeje: home
app.get('/static', (req, res) => {
  //para esta ruta renderizame productos y el css de productos de la carpeta public

  //necesito mostrar un listado de productos
  const PRODS = [
    //img: con ruta interna
    { id: 1, title: "celular", price: 1500, img: "./img/src/public/img/1707780153245celu1.jpg" },
    { id: 2, title: "celular", price: 1500, img: "https://www.megatone.net/Images/Articulos/zoom2x/209/02/KIT0454SSG.jpg" },
    { id: 3, title: "celular", price: 1500, img: "https://www.megatone.net/Images/Articulos/zoom2x/209/02/KIT0454SSG.jpg" },
    { id: 4, title: "celular", price: 1500, img: "https://www.megatone.net/Images/Articulos/zoom2x/209/02/KIT0454SSG.jpg" }
  ];


  res.render('templates/productos', {
    //mostrame estos productos bajo lo que seria un condicional. Por eso se usa :
    //cuando renderizo estos productos envio este condicional true, y envio este condicional de productos.
    mostrarProductos: true,
    productos: PRODS,

    css: 'productos.css'
  })
})
//sabe lo que voy a enviar por la configuracion previa app.set....




/*
RESUMEN: Se implementó un CRUD (Crear, Leer, Actualizar, Eliminar) para gestionar los productos utilizando el ProductManager.
Las operaciones incluyen:
- Obtener todos los productos y obtener un producto por su ID.
- Agregar un nuevo producto.
- Actualizar un producto existente.
- Eliminar un producto.
*/
