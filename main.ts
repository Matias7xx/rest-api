import {Server} from './server/server' //Importando o servidor criado
import {usersRouter} from './users/users.router'
import {restaurantsRouter} from './restaurants/restaurants.router'
import {reviewsRouter} from './reviews/reviews.router'
import {mainRouter} from './main.router'

const server = new Server()
server.bootstrap([
  usersRouter,
  restaurantsRouter,
  reviewsRouter,
  mainRouter
]).then(server => { //Conectado com sucesso
  console.log('Server is listening on: ', server.application.address())
}).catch(err => {
  console.log('Server failed to start')
  console.error(err)
  process.exit(1) //Parando execução
})
