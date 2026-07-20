import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError } from '../errors/index.js'
import { UnauthenticatedError } from '../errors/index.js'
import bcrypt from 'bcryptjs'

const register = async (req, res) => {
    // this is what we do when we do not have middleware pre in schema
    // const { name, email, password } = req.body

    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password, salt)

    // const tempUser = { name, email, password: hashedPassword }

    // const user = await User.create({ ...tempUser })

    // this is optional
    // if (!name || !email || !password) {
    //     throw new BadRequestError('provide all values')
    // }

    const user = await User.create({ ...req.body })

    const token = user.createJWT()

    res.status(StatusCodes.CREATED).json({ user: user.name, token })
}

const login = async (req, res) => {
    const { email, password } = req.body

    // check if we are getting email and password
    if (!email || !password) {
        throw new BadRequestError('provide all values')
    }

    // check if user exists
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('invalid credentials')
    }

    // check password (compare hash)
    const isCorrectPassword = await user.comparePassword(password)
    if (!isCorrectPassword) {
        throw new UnauthenticatedError('invalid credentials')
    }
    // send jwt after success login
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: user.name, token })
}

export { register, login }