import { faker } from "@faker-js/faker";

//const products = []

//Función para generar productos random, aleatorios
//NO ES NECESARIO AGREGAR EL ID EN ESTE MÓDULO.
//Datos: title/ description / stock / category / status / code/ proce/ thumbnail

export const createRandomProduct = () => {

    //retorna un producto random, la cual consultaré en la función
    return {
        //busco en pagina de faker donde esta lo de title: COMMERCE-product→titulo, lo copio y lo pego en el codigo.
        productTitle: faker.commerce.product(),
        productDescription: faker.commerce.productDescription(),
        productName: faker.commerce.productName(),
        productStock: faker.number.int(),
        productCategory: faker.commerce.department(),
        productStatus: faker.datatype.boolean(0.9),//probabilidad específica (como 90% para 'available'),con 0.9 es true/ vacío() →false.  otra opcion:  faker.helpers.arrayElement(['available', 'unavailable'])→claridad y flexibilidad para agregar más estados en el futuro
        //El International Standard Book Number (ISBN)
        productCode: faker.commerce.isbn(),
        //otra opcion:  faker.string.alphanumeric(10),
        productPrice: faker.commerce.price(),
    }

}


