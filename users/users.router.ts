//Arquivo dos usuários
//import {Router} from '../common/router'
import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {User} from './users.model'

class UsersRouter extends ModelRouter<User> {
    constructor() { //Event Emiter para não receber o password na Response da função GET
        super(User)
        this.on('beforeRender', document => {
            document.password = undefined
            //delete document.password //Outra alternativa
        })
    }
    //Versão do GET que filtra o usuário pelo email
    /*findByEmail = (req, res, next) => {
        if(req.query.email) {
            User.find({email: req.query.email})
                .then(this.renderAll(res, next))
                .catch(next)
        } else {
            next()
        }
    }*/

    findByEmail = (req, res, next) => {
        if(req.query.email) {
            User.findByEmail(req.query.email)
                .then(user => {
                    if(user) {
                        return [user]
                    } else {
                        return []
                    }
                })
                .then(this.renderAll(res, next))
                .catch(next)
        } else {
            next()
        }
    }

    applyRoutes(application: restify.Server) {
        
        //application.get({path:'/users', version: '1.0.0'}, this.findAll)
        //Criando outra versão da api GET para filtrar usuários por email
        application.get({path:'/users', version: '2.0.0'}, [this.findByEmail, this.findAll])
        application.get('/users/:id', [this.validateId, this.findById])
        application.post('/users', this.save)
        application.put('/users/:id', [this.validateId, this.replace])
        application.patch('/users/:id', [this.validateId, this.update])
        application.del('/users/:id', [this.validateId, this.delete] )
    }
}
//Associar o Router ao método Bootstrap do Server
export const usersRouter = new UsersRouter()