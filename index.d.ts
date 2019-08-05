//arquivo para o typescript entender a declaração de alguma interface
import {User} from './users/users.model'

declare module 'restify' {
    export interface Request {
        authenticated: User
    }
}