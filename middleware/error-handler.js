// import { CustomAPIError } from '../errors/index.js' 
import { StatusCodes } from 'http-status-codes'

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong try again later',
  }

  // now this is unnecessary because we created custom error which alr will take custom error class valaues
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.name === 'ValidationError') {
    customError.message = Object.values(err.errors).map((item) => item.message).join(',')
  }

  if (err.code && err.code === 11000) {
    customError.message = `duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
    customError.statusCode = 400
  }

  if (err.name === 'CastError') {
    customError.message = `no item found with id: ${err.value}`
    customError.statusCode = 404
  }

  return res.status(customError.statusCode).json({
    message: customError.message,
  })
}

export default errorHandlerMiddleware
