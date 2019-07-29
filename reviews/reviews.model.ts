import * as mongoose from 'mongoose'
import {Restaurant} from '../restaurants/restaurants.model'
import {User} from '../users/users.model'

export interface Review extends mongoose.Document { //Interface para ter o auto-complete
    date: Date,
    rating: number,
    comments: string,
    restaurant: mongoose.Types.ObjectId | Restaurant,
    user: mongoose.Types.ObjectId |  User
}

const reviewSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comments: {
        type: String,
        required: true,
        maxlength: 500
    },
    restaurant: { //Qual restaurante vai receber o Review
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', //Modelo que será referenciado
        required: true
    },
    user: { //Qual usuário escreveu o Review
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //Modelo que será referenciado
        required: true
    }
})

const Review = mongoose.model<Review>('Review', reviewSchema)