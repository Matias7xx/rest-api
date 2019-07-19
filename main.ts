import {Server} from './server/server' //Importando o servidor criado

const server = new Server()
server.bootstrap().then(server => { //Conectado com sucesso
  console.log('Server is listening on: ', server.application.address())
}).catch(err => {
  console.log('Server failed to start')
  console.error(err)
  process.exit(1) //Parando execução
})
