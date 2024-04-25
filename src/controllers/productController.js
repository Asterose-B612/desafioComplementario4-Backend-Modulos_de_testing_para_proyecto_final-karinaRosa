//MANEJO DE PRODUCTOS en una base de datos utilizando un ORM  (Object-Relational Mapping) como Mongoose en Node.js.


// Importa el modelo de producto desde el archivo product.js en la carpeta models
import productModel from "../models/product.js";


export const getProducts = async (query, options) => {

    try {
        // Paso 2: Construye el objeto de consulta para la base de datos, utilizando el filtro correspondiente.
        const query = filter ? (filter === 'true' || filter === 'false' ? { status: filter } : { category: filter }) : {};
        // Paso 3: Construye el objeto de consulta para el método de ordenamiento, utilizando 'price' como clave y 'sort' como dirección de ordenamiento.
        const sortQuery = sort ? { price: sort === 'asc' ? 1 : -1 } : {};
        // Paso 4: Realiza la consulta a la base de datos, aplicando el filtro, paginación y ordenamiento.
        const options = { limit: parseInt(limit), page: parseInt(page), sort: sortQuery };

        // Paso 5: Calcula si hay páginas previas y siguientes.
        const prevPage = products.prevPage ? parseInt(page) - 1 : null;
        const nextPage = products.nextPage ? parseInt(page) + 1 : null;


        const products = await productModel.paginate(query, options);
        return products

    } catch (e) {
        return (e)
    }
}





