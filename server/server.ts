import * as restify from 'restify'
import {environment} from '../common/environment'
import {Router} from '../common/router'

export class Server {

    application: restify.Server //Inicializar o server com restify
    //Os métodos InitRoutes e Bootstrap estão retornando uma Promise
    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })
                //Restify não fornece por padrão os valores dos parametros de URL.
                //É necessário configurar o server, SE NECESSÁRIO
                this.application.use(restify.plugins.queryParser())

                //Routes
                for (let router of routers) { //Iterando sobre todas as rotas do array
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application) //Informar conexão com sucesso
                })
            } catch (err) {
                reject(err)
            }
        })
    }
    //Para o médoto bootstrap é passado um array de rotas
    bootstrap(routers: Router[] = []): Promise<Server> { //Método que retorna a classe Server configurada
        return this.initRoutes(routers).then(() => this)
    }
}