import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import {NotAuthorizedError} from 'restify-errors'
import {User} from '../users/users.model'
import {environment} from '../common/environment'

export const authenticate: restify.RequestHandler = (req, res, next) => { //Autenticar usuario
    const {email, password} = req.body
    //Procurar o usuário com o email citado
    User.findByEmail(email, '+password') //Passo 1
        .then(user => {
            if(user && user.matches(password)) { //Passo 2 comparar o usuario e senha
                //Gerar o token
                //Passo 
                //({corpo do token}, password que vai assinar(gerar o token))
                const email: any = user.email
                const token = jwt.sign({sub: email, iss: 'meat-api'},
                    environment.security.apiSecret)
                res.json({name: user.name, email: user.email, accessToken: token})
                return next(false)
            } else {
                return next(new NotAuthorizedError('Invalid Credentials'))
            }
    }).catch(next)
}