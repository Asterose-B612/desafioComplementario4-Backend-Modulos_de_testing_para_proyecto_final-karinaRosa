import { faker } from "@faker-js/faker";


//Función para generar usuarios random, aleatorios
//NO ES NECESARIO AGREGAR EL ID EN ESTE MÓDULO.
//Datos:mail/ password/ username/ id/ Avatar/ img/ birthdate/registerAt

//MAIL - PASSWORD - USERNAME - ID - Avatar - Img - birthdate - registeredAt→ cuando se dio de alta el usuario
export const createRandomUser = () => {
    return {
        userId: faker.string.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        avatar: faker.image.avatarGitHub(),
        birthdate: faker.date.birthdate(),
        registerAt: faker.date.past(),
        loginAt: faker.date.recent(),
        biografy: faker.person.bio(),
        sex: faker.person.sex(),
        gender: faker.person.gender(),
        telephone: faker.phone.number()
    }
}

/*

for (let i = 0; i < 100; i++) {
    users.push(createRandomUser())
}

console.log(users)*/