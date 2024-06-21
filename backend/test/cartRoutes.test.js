import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
 // Importa el modelo de carrito desde la aplicación
import Cart from '../models/cart';
// Importa el modelo de producto desde la aplicación
import Product from '../models/product'; 
import varenv from '../src/dotenv.js';

const expect = chai.expect;
const requester = supertest('http://localhost:8000');

// Conectarse a la base de datos antes de ejecutar las pruebas
before(async function () {
    await mongoose.connect(varenv.mongo_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

describe('Test CRUD de carritos en la ruta api/cart', function () {
    let cartId;
    let productId;

    it('Debe crear un carrito vacío', async () => {
        const res = await requester.post('/api/cart');
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('_id');
        cartId = res.body._id;
    });

    it('Debe obtener un carrito por su ID', async () => {
        const res = await requester.get(`/api/cart/${cartId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('_id', cartId);
    });

    it('Debe insertar un producto en el carrito', async () => {
        const product = await Product.create({
            title: 'Producto de prueba',
            description: 'Descripción del producto de prueba',
            price: 100,
            stock: 10,
        });
        productId = product._id;

        const res = await requester
            .post(`/api/cart/${cartId}/${productId}`)
            .send({ quantity: 1 });

        expect(res.status).to.equal(200);
        // Verificar que el producto se haya insertado correctamente en el carrito
        const updatedCart = await Cart.findById(cartId);
        expect(updatedCart.products).to.be.an('array').that.is.not.empty;
        const insertedProduct = updatedCart.products.find(prod => prod.id_prod.toString() === productId.toString());
        expect(insertedProduct).to.exist;
    });

    it('Debe actualizar la cantidad de un producto en el carrito', async () => {
        const updatedQuantity = 2;

        const res = await requester
            .put(`/api/cart/${cartId}/products/${productId}`)
            .send({ quantity: updatedQuantity });

        expect(res.status).to.equal(200);
        // Verificar que la cantidad del producto se haya actualizado correctamente en el carrito
        const updatedCart = await Cart.findById(cartId);
        const updatedProduct = updatedCart.products.find(prod => prod.id_prod.toString() === productId.toString());
        expect(updatedProduct.quantity).to.equal(updatedQuantity);
    });

    it('Debe eliminar un producto del carrito', async () => {
        const res = await requester.delete(`/api/cart/${cartId}/products/${productId}`);
        expect(res.status).to.equal(200);
        // Verificar que el producto se haya eliminado correctamente del carrito
        const updatedCart = await Cart.findById(cartId);
        const deletedProduct = updatedCart.products.find(prod => prod.id_prod.toString() === productId.toString());
        expect(deletedProduct).to.not.exist;
    });

    it('Debe vaciar el carrito', async () => {
        const res = await requester.delete(`/api/cart/${cartId}`);
        expect(res.status).to.equal(200);
        // Verificar que el carrito esté vacío después de eliminar todos los productos
        const emptyCart = await Cart.findById(cartId);
        expect(emptyCart.products).to.be.an('array').that.is.empty;
    });

    it('Debe realizar la compra y generar un ticket', async () => {
        // Reinsertar un producto para la prueba de compra
        await requester.post(`/api/cart/${cartId}/${productId}`).send({ quantity: 1 });

        const res = await requester.post(`/api/cart/${cartId}/purchase`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('amount');
        expect(res.body).to.have.property('products');
    });

    it('Debe manejar un carrito inexistente', async () => {
        const invalidCartId = mongoose.Types.ObjectId();
        const res = await requester.get(`/api/cart/${invalidCartId}`);
        expect(res.status).to.equal(404);
    });

    it('Debe manejar la inserción de un producto con cantidad inválida', async () => {
        const res = await requester
            .post(`/api/cart/${cartId}/${productId}`)
            .send({ quantity: -1 });

        expect(res.status).to.equal(400); // Suponiendo que tu API devuelve 400 para solicitudes inválidas
    });

    it('Debe manejar la actualización del carrito con productos inválidos', async () => {
        const invalidProductId = mongoose.Types.ObjectId();
        const res = await requester
            .put(`/api/cart/${cartId}/products/${invalidProductId}`)
            .send({ quantity: 1 });

        expect(res.status).to.equal(404);
    });

    after(async function () {
        // Desconectar de la base de datos después de las pruebas
        await mongoose.disconnect(varenv.mongo_url);
    });
});
