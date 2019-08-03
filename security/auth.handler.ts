import * as restify from 'restify'
import {NotAuthorizedError} from 'restify-errors'
import {User} from '../users/users.model'

export const authenticate: restify.RequestHandler = (req, res, next) => { //Autenticar usuario
    const {email, password} = req.body
    //Procurar o usuário com o email citado
    User.findByEmail(email, '+password') //Passo 1
        .then(user => {
            if(user && user.matches(password)) { //Passo 2 comparar o usuario e senha
                //Gerar o token
                //Passo 3
            } else {
                return next(new NotAuthorizedError('Invalid Credentials'))
            }
    }).catch(next)
}