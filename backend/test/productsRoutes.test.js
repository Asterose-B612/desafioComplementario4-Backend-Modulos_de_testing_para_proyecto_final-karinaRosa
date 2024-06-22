import { expect } from 'chai';
import mongoose from 'mongoose';
import supertest from 'supertest';
import __dirname from '../src/path.js';
import varenv from '../src/dotenv.js';
//import jwt from 'jsonwebtoken';


// Conectarse a la base de datos antes de ejecutar las pruebas
before(async function () {
    await mongoose.connect(varenv.mongo_url);
});


const requester = supertest('http://localhost:8000');





describe('Test CRUD de productos en la ruta api/products', function () {

    it('Ruta: api/products metodo GET', async () => {
        // Simula una petición de tipo GET al servidor en la ruta api/products
        const { ok } = await requester.get('/api/products');
        console.log(ok);
        expect(ok).to.be.ok;
        /* expect(res.status).to.equal(200);
         expect(res.body).to.be.an('array');
         expect(res.body.length).to.be.above(0);*/
    });

    it('Ruta: api/products metodo POST', async () => {
        const newProduct = {
            title: "Iphone 12",
            description: "Smartphone",
            price: 1300000,
            code: "crhy5",
            stock: 15,
            category: "Smartphones",
            status: true // Asumiendo que el campo status es booleano y por defecto verdadero
        };

        const res = await requester.post('/api/products').send(newProduct);

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('_id');
        productId = res.body._id;
    });

    it('Ruta: api/products/:pid metodo PUT', async () => {
        const updatedProduct = {
            title: "Iphone 12 Pro",
            price: 1800000
        };

        const res = await requester.put(`/api/products/${productId}`).send(updatedProduct);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('title', 'Iphone 13 Pro');
    });

    it('Ruta: api/products/:pid metodo DELETE', async () => {
        const res = await requester.delete(`/api/products/${productId}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('_id', productId);
    });

    after(async function () {
        // Detener o limpiar recursos después de las pruebas
        await mongoose.disconnect();
    });
});
