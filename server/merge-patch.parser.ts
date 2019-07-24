//Arquivo que dará suporte ao Content-Type application/merge-patch+json para utilizar o método
//HTTP PATCH

import * as restify from 'restify'
import {BadRequestError} from 'restify-errors'

const mpContentType = 'application/merge-patch+json'

export const mergePatchBodyParser = (req: restify.Request, res: restify.Response, next) => {
    if(req.getContentType() === mpContentType && req.method === 'PATCH') {
        //(<any>req).req.rawBody = req.body //Se quiser guardar o body em alguma propriedade(OPCIONAL)
        try{
            req.body = JSON.parse(req.body)
        } catch(e) {
            return next(new BadRequestError(`Invalid content: ${e.message}`)) //Ou NEW ERROR caso não use restify
        }
    }
    return next()
}