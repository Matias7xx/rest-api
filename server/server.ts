import * as restify from 'restify'
import {environment} from '../common/environment'

export class Server {

    application: restify.Server //Inicializar o server com restify
    //Os métodos InitRoutes e Bootstrap estão retornando uma Promise
    initRoutes(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })
                //Restify não fornece por padrão os valores dos parametros de URL.
                //É necessário configurar o server, SE NECESSÁRIO
                this.application.use(restify.plugins.queryParser())

                //Rotas
                this.application.get('/info', [(req, res, next) => { //Foi passado um array de callbacks apenas para testar o Next()
                    if (req.userAgent() && req.userAgent().includes('MSIE 7.0')) { //Se o browser for IE 7.0
                        res.status(400)
                        //res.json({ message: 'Please, update your browser!' })
                        let error: any = new Error() //Passando um erro para o next()
                        error.statusCode = 400
                        error.message = 'Please, update your browser!'
                        return next(error)
                    }
                    return next()
                }, (req, res, next) => {
                    //res.contentType = 'application/json'; //Restify faz por padrão
                    //res.status(400) //Alterando o status da requisição
                    //-res.setHeader('Content-Type', 'application/json') //Outra forma de setar o Content-Type
                    //-res.send({message: 'Hello World!'});
                    res.json({
                        browser: req.userAgent(), //Retorna o Browser utilizado
                        method: req.method, //Retorna o método HTTP, neste caso GET
                        url: req.href(), //Ou req.url para exibir a URL
                        path: req.path(), //Caminho da rota
                        query: req.query //Parametros de url utilizados
                    })
                    return next()
                }])

                this.application.listen(environment.server.port, () => {
                    resolve(this.application) //Informar conexão com sucesso
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    bootstrap(): Promise<Server> { //Método que retorna a classe Server configurada
        return this.initRoutes().then(() => this)
    }
}