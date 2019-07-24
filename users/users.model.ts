import * as mongoose from 'mongoose'
import {validateCPF} from '../common/validators'
//mongoose.set('useCreateIndex', true) //Foi inserido diretamente na conexão

export interface User extends mongoose.Document { //Interface para gerar auto complete no router
    name: string,
    email: string,
    password: string
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80, //Quantidade máxima de characters
        minlength: 3 //Quantidade mínima de charactes
    },
    email: {
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, //Expressão regular para validar email
        required: true //Não pode ser null
    },
    password: {
        type: String,
        select: false, //Não vai trazer o campo de senha por padrão
        required: true, //Não pode ser null
        maxlength: 15,
        minlength: 7
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female'] //2 tipos de escolha
    },
    cpf: {
        type: String,
        required: false,
        validate: [ //Validador personalizado
            validateCPF,
            '{PATH}: Invalid CPF ({VALUE})'
        ]
    }
})
//Foi passado a interface User dentro do Generics <>
export const User = mongoose.model<User>('User', userSchema) //Collection de Usuários