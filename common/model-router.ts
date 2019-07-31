import {Router} from './router'
//model que vai permitir maior reuso nos métodos Rest (Utilizar o mesmo get em users,restaurants, etc)
import * as mongoose from 'mongoose'
import {NotFoundError} from 'restify-errors'

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    //Caminho dos links hypermidia
    basePath: string

    pageSize: number = 4 //Paginação

    constructor(protected model: mongoose.Model<D>) {
        super()
        this.basePath = `/${model.collection.name}`
    }

    //Outra forma de pegar o nome usuario e restaurante na Review
    protected prepareOne(query: mongoose.DocumentQuery<D,D>): mongoose.DocumentQuery<D,D> {
        return query
    }

    //Utilizando o envelope HYPERMIDIA
    envelope(document: any): any {
        let resource = Object.assign({_links: {}}, document.toJSON())
        resource._links.self = `${this.basePath}/${resource._id}`
        return resource
    }

    //Envelope para paginação
    envelopeAll(documents: any[], options: any = {}): any {
        const resource: any = {
            _links: {
                self: `${options.url}` //Página atual
            },
            items: documents
        }
        if(options.page && options.count && options.pageSize) {
            if(options.page > 1) {
                resource._links.previous = `${this.basePath}?_page=${options.page-1}`
            }
            const remaining = options.count - (options.page * options.pageSize)
            if(remaining > 0) {
                resource._links.next = `${this.basePath}?_page=${options.page+1}`
            }
        }
        return resource
    }

    validateId = (req, res, next) => { //Verifica se o ID existe
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError('Document not found'))
        } else {
            next()
        }
    }

    findAll = (req, res, next) => { //GET
        let page = parseInt(req.query._page || 1) //Lógica de paginação
        page = page > 0 ? page : 1

        const skip = (page -1) * this.pageSize

        this.model
            .countDocuments({}).exec()
            .then(count => this.model.find()
            .skip(skip)
            .limit(this.pageSize) //Paginação
            .then(this.renderAll(res, next, {
                    page, count, pageSize: this.pageSize, url: req.url
                })))
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