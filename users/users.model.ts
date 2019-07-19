const users = [
    { id: '1', name: 'Gabriel Nóbrega', email: 'matiasnobrega7@' },
    { id: '2', name: 'Camila', email: 'camilanobrega7@' }
]

export class User { //Emula um GET
    static findAll(): Promise<any[]> { //Pegando todos os usuários
        return Promise.resolve(users)
    }

    static findById(id: string): Promise<any> { //Emula um Get by ID
        return new Promise(resolve=> {
            const filtered = users.filter(user => user.id === id)
            let user = undefined
            if(filtered.length > 0) {
                user = filtered[0]
            }
            resolve(user)
        })
    }
}