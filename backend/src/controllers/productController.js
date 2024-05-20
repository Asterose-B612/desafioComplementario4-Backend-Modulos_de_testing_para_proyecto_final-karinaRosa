//MANEJO DE PRODUCTOS en una base de datos utilizando un ORM  (Object-Relational Mapping) como Mongoose en Node.js.


// Importa el modelo de producto desde el archivo product.js en la carpeta models
import productModel from "../models/product.js";


// inicio OBTENER PRODUCTOS..............................
export const getProducts = async (req, res) => {
    console.log(req)
    try {
        const { limit, page, filter, ord } = req.query;
        let metFilter;
        const pag = page !== undefined ? page : 1;
        const limi = limit !== undefined ? limit : 10;

        if (filter == "true" || filter == "false") {
            metFilter = "status"
        } else {
            if (filter !== undefined)
                metFilter = "category";
        }

        const query = metFilter != undefined ? { [metFilter]: filter } : {};
        const ordQuery = ord !== undefined ? { price: ord } : {};

        const prods = await productModel.paginate(query, { limit: limi, page: pag, sort: ordQuery });

        res.status(200).send(prods)

    } catch (error) {
        res.status(500).render('templates/error', {
            error: error,
        });
    }
}

/*
export const getProducts = async (limit, page, filter, sort) => {
    console.log (req)

    try {
        // Paso 2: Construye el objeto de consulta para la base de datos, utilizando el filtro correspondiente.
        const query = filter ? (filter === 'true' || filter === 'false' ? { status: filter } : { category: filter }) : {};
        // Paso 3: Construye el objeto de consulta para el método de ordenamiento, utilizando 'price' como clave y 'sort' como dirección de ordenamiento.
        const sortQuery = sort ? { price: sort === 'asc' ? 1 : -1 } : {};
        // Paso 4: Realiza la consulta a la base de datos, aplicando el filtro, paginación y ordenamiento.
        const options = { limit: parseInt(limit), page: parseInt(page), sort: sortQuery };

        // Paso 5: Realiza la consulta a la base de datos utilizando el modelo de producto y los criterios de búsqueda.
        const products = await productModel.paginate(query, options);

        // Paso 5: Calcula si hay páginas previas y siguientes.
        const prevPage = products.prevPage ? parseInt(page) - 1 : null;
        const nextPage = products.nextPage ? parseInt(page) + 1 : null;

        return products

    } catch (error) {
        // Si ocurre un error, devuelve un objeto de error con un código de estado 500.
        return { error: error };
    }
}*/
// inicio OBTENER PRODUCTOS..............................







// inicio OBTENER PRODUCTO..............................

export const getProduct = async (req, res) => {
    try {
        const idProducto = req.params.pid //Todo dato que se consulta desde un parametro es un string
        const prod = await productModel.findById(idProducto)
        if (prod)
            res.status(200).send(prod)
        else
            res.status(404).send("Producto no existe")
    } catch (error) {
        res.status(500).send(`Error interno del servidor al consultar producto: ${error}`)
    }
}
// fin OBTENER PRODUCTO..............................





// inicio CREAR PRODUCTO .........................

export const createProduct = async (req, res) => {
    console.log(req.user)
    console.log(req.user.rol)
    try {
        if (req.user.rol == "Admin") {
            const product = req.body
            const mensaje = await productModel.create(product)
            res.status(201).send(mensaje)
        } else {
            res.status(403).send("Usuario no autorizado")
        }


    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
}

// fin CREAR PRODUCTO .........................






// inicio ACTUALIZAR PRODUCTO EXISTENTE..........................................

export const updateProduct = async (req, res) => {
    try {
        if (req.user.rol == "Admin") {
            const idProducto = req.params.pid
            const updateProduct = req.body
            const prod = await productModel.findByIdAndUpdate(idProducto, updateProduct)
            res.status(200).send(prod)
        } else {
            res.status(403).send("Usuario no autorizado")
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`)
    }
}
// fin ACTUALIZAR PRODUCTO EXISTENTE..........................................







// inicio ElIMINAR PRODUCTO EXISTENTE x su id .........................


export const deleteProduct = async (req, res) => {
    try {
        console.log(req.user.rol)
        if (req.user.rol == "Admin") {
            const idProducto = req.params.pid
            const mensaje = await productModel.findByIdAndDelete(idProducto)
            res.status(200).send(mensaje)
        } else {
            res.status(403).send("Usuario no autorizado")
        }
    } catch (error) {
        res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`)
    }
}
// fin ElIMINAR PRODUCTO EXISTENTE x su id .........................




