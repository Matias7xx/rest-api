//Arquivo dos usuários
import {Router} from '../common/router'
import * as restify from 'restify'
import {NotFoundError} from 'restify-errors'
import {User} from './users.model'

class UsersRouter extends Router {
    constructor() { //Event Emiter para não receber o nome na Response da função GET
        super()
        this.on('beforeRender', document => {
            document.password = undefined
            //delete document.password //Outra alternativa
        })
    }

    applyRoutes(application: restify.Server) {
        
        application.get('/users', (req, res, next) => { //ROTA USERS
            /*User.find().then(users => { //Método que vai retornar os usuários
            res.json(users)
            return next()
            })*/
            User.find()
                .then(this.render(res, next))
                .catch(next)
        })

        application.get('/users/:id', (req, res, next) => {
            /*User.findById(req.params.id).then(user => {
                if(user) {
                    res.json(user)
                    return next()
                }
                res.send(404)
                return next()
            })*/
            User.findById(req.params.id)
                .then(this.render(res, next))
                .catch(next)
        })

        application.post('/users', (req, res, next) => {
            let user = new User(req.body)
            /*user.save().then(user => {
                user.password = undefined //Não exibir a senha no Postman(Corpo da req)
                res.json(user)
                return next()
            })*/
            user.save()
                .then(this.render(res, next))
                .catch(next)
        })

        application.put('/users/:id', (req, res, next) => { //Atualizar um documento inteiro
            const options = { overwrite : true } //Indicar que queremos sobreesrever todo o documento
            User.update({ _id:req.params.id }, req.body, options) //{O que sera atualizado}, novo documento)
                .exec().then(result => {
                    if(result.n) {
                        return User.findById(req.params.id)
                    } else {
                        //res.send(404)
                        throw new NotFoundError('Documento não encontrado!')
                    }
                })/*.then(user => {
                    res.json(user)
                    return next()
                })*/
                .then(this.render(res, next))
                .catch(next)
        })

        application.patch('/users/:id', (req, res, next) => { //Atualização parcial do documento
            const options = {new : true} //Receber o documento atualizado
            /*User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(user => {
                    if(user) {
                        res.json(user)
                        return next()
                    }
                    res.send(404)
                    return next()
                }) */
                User.findByIdAndUpdate(req.params.id, req.body, options)
                    .then(this.render(res, next))
                    .catch(next)
        })

        application.del('/users/:id', (req, res, next) => { //REMOVER
            User.deleteOne({_id: req.params.id}).exec().then((cmdResult: any) => {
                if(cmdResult.n) {
                    res.json({message: 'Usuário removido com sucesso!'})
                    res.send(204)
                } else {
                    //res.send(404)
                    throw new NotFoundError('Documento não encontrado!')
                }
                return next()
            }).catch(next)
        })
    }
}
//Associar o Router ao método Bootstrap do Server
export const usersRouter = new UsersRouter()