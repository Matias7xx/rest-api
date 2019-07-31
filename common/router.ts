import * as restify from 'restify'
import { EventEmitter } from 'events'; //Padrão do node com funções de renderizações
import {NotFoundError} from 'restify-errors'

export abstract class Router extends EventEmitter {//Configuração de rotas
    abstract applyRoutes(application: restify.Server) //applyRoutes recebe uma instância do servidor

    //método que "envelopa um documento" para uso de hypermidia
    envelope(document: any): any {
        return document
    }

    render(response: restify.Response, next: restify.Next) { //Função de reuso nos metodos HTTP //Renderiza um documento
        return (document) => {
            if(document) {
                this.emit('beforeRender', document) //Event emiter
                response.json(this.envelope(document))
            } else {
                //response.send(404)
                throw new NotFoundError('Documento não encontrado!')
            }
            return next(false) //false para a requisição não caia em outro handler
        }
    }

    renderAll(response: restify.Response, next: restify.Next) { //Renderiza um array de documentos para o GET
        return (documents: any[]) => {
            if(documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document)
                    array[index] = this.envelope(document)
                })
                response.json(documents)
            } else {
                response.json([])
            }
            return next(false) //false para a requisição não caia em outro handler
        }
    }
}