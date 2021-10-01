const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')

const userRouter = require('./routes/userRoutes')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const app = express();

// 1) Global MIDDLEWARES

// Set security HTTP headers
app.use(helmet())

// Development Logging
if (process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'))
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  })
  
app.use('/api',limiter)
  
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))

// Data Sanitization against NoSql query injection
app.use(mongoSanitize())

// Data Sanitization against XSS
app.use(xss())
app.use(cookieParser())
// routes
app.use('/api/v1/users', userRouter)

// HANDLING UNHANDLED ROUTES
app.all('*', (req, res, next) => {
    next(new AppError(`Cann't Find ${req.originalUrl} on this Server!`, 404))
})
  
app.use(globalErrorHandler)
  
module.exports = app;