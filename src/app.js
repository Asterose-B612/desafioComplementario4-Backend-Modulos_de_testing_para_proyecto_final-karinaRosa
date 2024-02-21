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

//console.log(__dirname)

//*******CONFIGURACIONES O DECLARACIONES******************

// Se crea una instancia de Express para configurar el servidor.
const app = express();
// Se define el puerto en el que el servidor estará escuchando.
const PORT = 8000


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
    {id:1, title: "celular" , price: 1500, img: "https://www.megatone.net/Images/Articulos/zoom2x/209/02/KIT0454SSG.jpg"}},
    {id:2, title: "celular" , price: 1500, img: "https://www.megatone.net/Images/Articulos/zoom2x/209/02/KIT0454SSG.jpg"}},
    {id:3, title: "celular" , price: 1500, img: "https://www.megatone.net/Images/Articulos/zoom2x/209/02/KIT0454SSG.jpg"}},
    {id:4, title: "celular" , price: 1500, img: "https://www.megatone.net/Images/Articulos/zoom2x/209/02/KIT0454SSG.jpg"}
  ]


  res.render ('productos' , {
    //mostrame estos productos bajo lo que seria un condicional. Por eso se usa :
    //cuando renderizo estos productos envio este condicional true, y envio este condicional de productos.
mostrarProductos : true,
productos : PRODS,

    css: 'productos.css'
  })
})
//sabe lo que voy a enviar por la configuracion previa app.set....




//*******SERVER******************

// Se define el servidor utilizando la variable 'app'.
// El servidor escucha en el puerto definido por la variable 'PORT'.
// Cuando el servidor está activo, se ejecuta una función anónima para mostrar un mensaje de estado en la consola.
app.listen(PORT, () => {
  // Muestra un mensaje en la consola indicando que el servidor está activo y escuchando en el puerto especificado.
  console.log(`Server on port ${PORT}`);
});


/*
RESUMEN: Se implementó un CRUD (Crear, Leer, Actualizar, Eliminar) para gestionar los productos utilizando el ProductManager.
Las operaciones incluyen:
- Obtener todos los productos y obtener un producto por su ID.
- Agregar un nuevo producto.
- Actualizar un producto existente.
- Eliminar un producto.
*/
