import crypto from 'crypto';
// Importar la API de promesas de fs
import { promises as fs } from 'fs';



export class CartManager {
    constructor(path) {
        // El path debe incluir la ruta completa al archivo de productos vacíos
        this.id = crypto.randomBytes(10).toString('hex');
        // La propiedad products apunta al archivo de productos
        // Cada vez que se consulta products, se consulta el path
        this.products = path;
        // Se va a alojar el archivo cart.json
    }


//*****  Metodos  ********/

    // Método asincrónico para devolver los productos del carrito
    async getCart() {
        // Leer el contenido actual del carrito desde el archivo JSON
        const CART = JSON.parse(await fs.readFile(this.products, 'utf-8'));
        return CART;
    }
    

 // Método asincrónico para agregar un producto al carrito por su ID y cantidad
 async addProductByCart(idProducto, quantityParam) {
    // Leer el contenido actual del carrito desde el archivo JSON
    const CART = JSON.parse(await fs.readFile(this.products, 'utf-8'));

    // Buscar el índice del producto en el carrito por su ID
    const indice = CART.findIndex(product => product.id == idProducto);

    // Si el producto ya está en el carrito
    if (indice != -1) {
        // Actualizar la cantidad del producto sumando la nueva cantidad proporcionada
        CART[indice].quantity += quantityParam;
    } else {
        // Si el producto no está en el carrito, crear un nuevo objeto con su ID y la cantidad proporcionada
        const prod = { id: idProducto, quantity: quantityParam };
        // Agregar el nuevo producto al carrito
        CART.push(prod);
    }

    // Escribir la información actualizada del carrito de vuelta al archivo JSON
    await fs.writeFile(this.products, JSON.stringify(CART));

    // Devolver un mensaje indicando que el producto se ha agregado correctamente al carrito
    return "Producto cargado correctamente";
}
}

