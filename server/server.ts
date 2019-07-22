import * as restify from 'restify'
import * as mongoose from 'mongoose'
import {environment} from '../common/environment'
import {Router} from '../common/router'

export class Server {

    application: restify.Server //Inicializar o server com restify

    initializeDb() { //Promise que inicializa o Banco
        (<any>mongoose).Promise = global.Promise //Remover se não for usar TypeScript
        mongoose.set('useCreateIndex', true) //Necessário
        return  mongoose.connect(environment.db.url, {
            useNewUrlParser: true, //NOVO JEITO DE CONEXÃO
            //useMongoClient: true //JEITO ANTIGO (DEPRECATED)
        }).catch(e => {
            const msg = 'ERRO! Não foi possível conectar com o MongoDB!'
            console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m') //Caracteres especiais de warning vermelho
        })
    }

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
                this.application.use(restify.plugins.queryParser()) //Parser dos parametros da URL
                this.application.use(restify.plugins.bodyParser()) //Parser do corpo da req para JSON

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
        return this.initializeDb().then(() => //Inicializando o BANCO
            this.initRoutes(routers).then(() => this)) //Inicializando as Rotas
    }
}