import * as restify from 'restify'

export abstract class Router {//Configuração de rotas
    abstract applyRoutes(application: restify.Server) //applyRoutes recebe uma instância do servidor

}