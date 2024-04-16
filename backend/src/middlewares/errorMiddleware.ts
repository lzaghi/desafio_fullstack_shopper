import { type ErrorRequestHandler } from 'express'

const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500
  const message = err.statusCode ? err.message : 'Internal server error'
  return res.status(statusCode).json({ message })
}

export default errorMiddleware
