import 'jest'
import * as request from 'supertest'

const address : string = (<any>global).address //Reuso da url
const auth : string = (<any>global).auth //Teste após implemento da segurança

test('get /users', () => { //Nome do teste, o que o teste vai executar
    return request(address)
        .get('/users')
        .set('Authorization', auth)
        .then(response => {
            expect(response.body.items).toBeInstanceOf(Array)
            expect(response.status).toBe(200) //Espero que a requisição seja um sucesso
        }).catch(fail)
})

test('post /users', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'UsuarioTeste',
            email: 'testepost@email.com',
            password: '1234567',
            cpf: '121.627.234-41'
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('UsuarioTeste')
            expect(response.body.email).toBe('testepost@email.com')
            expect(response.body.cpf).toBe('121.627.234-41')
            expect(response.body.password).toBeUndefined()
        }).catch(fail)
})

test('get /users/aaaaa - not found', () => {
    return request(address)
        .get('/users/aaaaa')
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(404) //Espero que a requisição seja um sucesso
        }).catch(fail)
})

test('patch /users/:id',() => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'UsuarioTestePatch',
            email: 'testepatch2@email.com',
            password: '1234567',
        })
        .then(response => request(address)
                            .patch(`/users/${response.body._id}`)
                            .set('Authorization', auth)
                            .send({
                                name: 'usuario2 - atualizado'
                            }))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('usuario2 - atualizado')
            expect(response.body.email).toBe('testepatch2@email.com')
            expect(response.body.password).toBeUndefined()
        })
        .catch(fail)
})

//yarn test para executar
//npm test / npm run test para executar