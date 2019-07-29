import * as restify from 'restify'
import * as mongoose from 'mongoose'
import {ModelRouter} from '../common/model-router'
import {Review} from './reviews.model'

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

    applyRoutes(application: restify.Server) {
        
        application.get('/reviews', this.findAll)
        application.get('/reviews/:id', [this.validateId, this.findById])
        application.post('/reviews', this.save)
    }
}

export const reviewsRouter = new ReviewsRouter()