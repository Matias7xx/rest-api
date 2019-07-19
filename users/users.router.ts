//Arquivo dos usuários
import {Router} from '../common/router'
import * as restify from 'restify'
import {User} from './users.model'

class UsersRouter extends Router {
    applyRoutes(application: restify.Server) {
        
        application.get('/users', (req, res, next) => { //ROTA USERS
            User.findAll().then(users => { //Método que vai retornar os usuários
            res.json(users)
            return next()
            })
        })

        application.get('/users/:id', (req, res, next) => {
            User.findById(req.params.id).then(user => {
                if(user) {
                    res.json(user)
                    return next()
                }
                res.send(404)
                return next()
            })
        })
    }
}
//Associar o Router ao método Bootstrap do Server
export const usersRouter = new UsersRouter()