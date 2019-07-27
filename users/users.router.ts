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

    applyRoutes(application: restify.Server) {
        
        application.get('/users', this.findAll)
        application.get('/users/:id', [this.validateId, this.findById])
        application.post('/users', this.save)
        application.put('/users/:id', [this.validateId, this.replace])
        application.patch('/users/:id', [this.validateId, this.update])
        application.del('/users/:id', [this.validateId, this.delete] )
    }
}
//Associar o Router ao método Bootstrap do Server
export const usersRouter = new UsersRouter()