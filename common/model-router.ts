import {Router} from './router'
//model que vai permitir maior reuso nos métodos Rest (Utilizar o mesmo get em users,restaurants, etc)
import * as mongoose from 'mongoose'
import {NotFoundError} from 'restify-errors'

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    constructor(protected model: mongoose.Model<D>) {
        super()
    }

    //Outra forma de pegar o nome usuario e restaurante na Review
    protected prepareOne(query: mongoose.DocumentQuery<D,D>): mongoose.DocumentQuery<D,D> {
        return query
    }

    validateId = (req, res, next) => { //Verifica se o ID existe
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError('Document not found'))
        } else {
            next()
        }
    }

    findAll = (req, res, next) => { //GET
        this.model.find()
            .then(this.renderAll(res, next))
            .catch(next)
    }

    findById = (req, res, next) => { //GETBYID
        this.prepareOne(this.model.findById(req.params.id)) //PrepareOne forma de pegar o nome usuario e restaurante na Review
            .then(this.render(res, next))
            .catch(next)
    }

    save = (req, res, next) => { //INSERT
        let document = new this.model(req.body)
        document.save()
            .then(this.render(res, next))
            .catch(next)
    }

    replace = (req, res, next) => { //Atualizar um documento inteiro
        const options = { runValidators: true, overwrite : true } //OVERWRITE Indicar que queremos sobreesrever todo o documento
        //runValidators - Indica que queremos aplicar validações
        this.model.update({ _id:req.params.id }, req.body, options) //{O que sera atualizado}, novo documento)
            .exec().then(result => {
                if(result.n) {
                    return this.model.findById(req.params.id)
                } else {
                    throw new NotFoundError('Documento não encontrado!')
                }
            })
            .then(this.render(res, next))
            .catch(next)
    }

    update = (req, res, next) => { //Atualização parcial do documento
        const options = {runValidators: true, new : true} //Receber o documento atualizado
            this.model.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(res, next))
                .catch(next)
    }

    delete = (req, res, next) => { //REMOVER
        this.model.deleteOne({_id: req.params.id}).exec().then((cmdResult: any) => {
            if(cmdResult.n) {
                res.json({message: 'Usuário removido com sucesso!'})
                res.send(204)
            } else {
                //res.send(404)
                throw new NotFoundError('Documento não encontrado!')
            }
            return next()
        }).catch(next)
    }
}