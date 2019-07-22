import * as restify from 'restify'
import { EventEmitter } from 'events'; //Padrão do node com funções de renderizações

export abstract class Router extends EventEmitter {//Configuração de rotas
    abstract applyRoutes(application: restify.Server) //applyRoutes recebe uma instância do servidor

    render(response: restify.Response, next: restify.Next) { //Função de reuso nos metodos HTTP
        return (document) => {
            if(document) {
                this.emit('beforeRender', document) //Event emiter
                response.json(document)
            } else {
                response.send(404)
            }
            return next()
        }
    }
}