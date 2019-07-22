import * as mongoose from 'mongoose'
//mongoose.set('useCreateIndex', true) //Foi inserido diretamente na conexão

export interface User extends mongoose.Document { //Interface para gerar auto complete no router
    name: string,
    email: string,
    password: string
}

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false //Não vai trazer o campo de senha por padrão
    }
})
//Foi passado a interface User dentro do Generics <>
export const User = mongoose.model<User>('User', userSchema) //Collection de Usuários