import * as restify from 'restify'

const server = restify.createServer({
  name: 'meat-api',
  version: '1.0.0'
})
//Restify não fornece por padrão os valores dos parametros de URL.
//É necessário configurar o server, SE NECESSÁRIO
server.use(restify.plugins.queryParser())

server.get('/info', [(req, res, next) => { //Foi passado um array de callbacks apenas para testar o Next()
  if(req.userAgent() && req.userAgent().includes('MSIE 7.0')) { //Se o browser for IE 7.0
    res.status(400)
    //res.json({ message: 'Please, update your browser!' })
    let error: any = new Error() //Passando um erro para o next()
    error.statusCode = 400
    error.message = 'Please, update your browser!'
    return next(error)
  }
  return next()
},(req, res, next)=>{
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

server.listen(3000, ()=>{
  console.log('API is running on http://localhost:3000')
})
