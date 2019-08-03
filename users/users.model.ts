import * as mongoose from 'mongoose'
import {validateCPF} from '../common/validators'
import * as bcrypt from 'bcrypt'
import {environment} from '../common/environment'
//mongoose.set('useCreateIndex', true) //Foi inserido diretamente na conexão

export interface User extends mongoose.Document { //Interface para gerar auto complete no router
    name: string,
    email: string,
    password: string,
    cpf: string,
    gender: string,
    matches(password: string): boolean
}

//Método personalizado no Model para filtrar usuários por email (UTILIZAR CASO O SISTEMA UTILIZE MUITO ESSE FILTRO)
export interface UserModel extends mongoose.Model<User> {
    findByEmail(email: string, projection?: string): Promise<User>
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
//Método personalizado no Model para filtrar usuários por email (UTILIZAR CASO O SISTEMA UTILIZE MUITO ESSE FILTRO)
userSchema.statics.findByEmail = function(email: string, projection: string) {
    return this.findOne({email}, projection) //{email: email}
}

//Método de instância no Schema para o token JWT
userSchema.methods.matches = function(password: string): boolean {
//comparar o password e o hash do BCrypt
    return bcrypt.compareSync(password, this.password)

}

const hashPassword = (obj, next) => { //Código para reutilizar as middlewares
    bcrypt.hash(obj.password, environment.security.saltRounds) //hash(senha, nª de rounds)
    .then(hash => {
        obj.password = hash
        next()
    }).catch(next)
}

const saveMiddleware = function(this: User, next){ //Código para reutilizar as middlewares
    const user: User = this
    if(!user.isModified('password')){ //Se o password não foi modificado, continua com next
        next()
    } else {
        hashPassword(user, next)
    }
}

const updateMiddleware = function(next){ //Código para reutilizar as middlewares
    if(!this.getUpdate().password){ //Se o password não foi modificado, continua com next
        next()
    } else {
        hashPassword(this.getUpdate(), next)
    }
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware) //Método Patch
userSchema.pre('update', updateMiddleware) //Put

//Criptografar senha com Bcrypt
/*userSchema.pre('save', function(this: User, next){
    const user: User = this
    if(!user.isModified('password')){ //Se o password não foi modificado, continua com next
        next()
    } else {
        bcrypt.hash(user.password, environment.security.saltRounds) //hash(senha, nª de rounds)
            .then(hash => {
                user.password = hash
                next()
            }).catch(next)
    }
})*/

//Middleware que faz o hash(criptografa senha) no momento do update
/*userSchema.pre('findOneAndUpdate', function(next){
    if(!this.getUpdate().password){ //Se o password não foi modificado, continua com next
        next()
    } else {
        bcrypt.hash(this.getUpdate().password, environment.security.saltRounds) //hash(senha, nª de rounds)
            .then(hash => {
                this.getUpdate().password = hash
                next()
            }).catch(next)
    }
})*/

//Foi passado a interface User dentro do Generics <>
export const User = mongoose.model<User, UserModel>('User', userSchema) //Collection de Usuários