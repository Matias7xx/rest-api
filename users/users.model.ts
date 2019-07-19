const users = [
    { name: 'Gabriel Nóbrega', email: 'matiasnobrega7@' },
    { name: 'Camila', email: 'camilanobrega7@' }
]

export class User {
    static findAll(): Promise<any[]> { //Pegando todos os usuários
        return Promise.resolve(users)
    }
}