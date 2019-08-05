import * as restify from 'restify'
import * as mongoose from 'mongoose'
import {ModelRouter} from '../common/model-router'
import {Review} from './reviews.model'
import {authorize} from '../security/authz.handler'

class ReviewsRouter extends ModelRouter<Review>{
    constructor() {
        super(Review)
    }

    //Modificar o findById para pegar o usuario e o restaurante que fizeram o review
    /*findById = (req, res, next) => { //GETBYID
        this.model.findById(req.params.id)
            .populate('user', 'name')
            .populate('restaurant', 'name')
            .then(this.render(res, next))
            .catch(next)
    }*/
    
    //Outra forma de pegar o nome do usuario e restaurante que fizeram o review
    protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        return query.populate('user', 'name')
                    .populate('restaurant', 'name')
    }

    //Hypermidia para o link do restaurante que recebeu o review
    envelope(document) {
        let resource = super.envelope(document)
        const restId = document.restaurant._id ? document.restaurant._id : document.restaurant
        resource._links.restaurant = `/restaurants/${restId}`
        return resource
    }


    applyRoutes(application: restify.Server) {
        
        /* application.get('/reviews', this.findAll)
        application.get('/reviews/:id', [this.validateId, this.findById])
        application.post('/reviews', this.save)*/
        //Aplicando links de hypermidia
        application.get(`${this.basePath}`, this.findAll)
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, [authorize('user'), this.save])
    }
}

export const reviewsRouter = new ReviewsRouter()