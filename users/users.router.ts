//Arquivo dos usuários
import {Router} from '../common/router'
import * as restify from 'restify'
import {User} from './users.model'

class UsersRouter extends Router {
    applyRoutes(application: restify.Server) {
        
        application.get('/users', (req, res, next) => { //ROTA USERS
            User.find().then(users => { //Método que vai retornar os usuários
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

        application.post('/users', (req, res, next) => {
            let user = new User(req.body)
            user.save().then(user => {
                user.password = undefined //Não exibir a senha no Postman(Corpo da req)
                res.json(user)
                return next()
            })
        })

        application.put('/users/:id', (req, res, next) => { //Atualizar um documento inteiro
            const options = { overwrite : true } //Indicar que queremos sobreesrever todo o documento
            User.update({ _id:req.params.id }, req.body, options) //{O que sera atualizado}, novo documento)
                .exec().then(result => {
                    if(result.n) {
                        return User.findById(req.params.id)
                    } else {
                        res.send(404)
                    }
                }).then(user => {
                    res.json(user)
                    return next()
                })
        })

        application.patch('/users/:id', (req, res, next) => { //Atualização parcial do documento
            const options = {new : true} //Receber o documento atualizado
            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(user => {
                    if(user) {
                        res.json(user)
                        return next()
                    }
                    res.send(404)
                    return next()
                })
        })

        application.del('/users/:id', (req, res, next) => { //REMOVER
            User.deleteOne({_id: req.params.id}).exec().then((cmdResult: any) => {
                if(cmdResult.n) {
                    res.json({message: 'Usuário removido com sucesso!'})
                    res.send(204)
                } else {
                    res.send(404)
                }
                return next()
            })
        })
    }
}
//Associar o Router ao método Bootstrap do Server
export const usersRouter = new UsersRouter()