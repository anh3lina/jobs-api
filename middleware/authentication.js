import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import UnauthenticatedError from '../errors/unauthenticated.js'

const auth = (req, res, next) => {
    //check header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('auth error')
    }

    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        // if we have logic to remove user here we should always check
        // if user is still in the database 

        // attach user to job routes so in routes we know who sends request
        req.user = { userId: payload.userId, name: payload.name }
        next()
    } catch (error) {
        throw new UnauthenticatedError('auth error: cant verify token')
    }
}

export default auth