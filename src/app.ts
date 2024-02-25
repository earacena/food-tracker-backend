import express, { type RequestHandler } from 'express'
import { CORS_ORIGIN, NODE_ENV, PORT } from './config'
import foodItemRouter from './api/foodItems/foodItem.routes'
import errorHandler from './middleware/errorHandler.middleware'
import mealRouter from './api/meals/meal.routes'
import mealEntryRouter from './api/mealEntries/mealEntry.routes'
import authenticate from './middleware/authenticate'
import profileRouter from './api/profiles/profile.routes'
import activityRouter from './api/activities/activity.routes'
import morgan from 'morgan'
import { applicationDefault, initializeApp } from 'firebase-admin/app'
import cors from 'cors'

// Initialize Firebase
if (NODE_ENV !== 'test') {
  initializeApp({
    credential: applicationDefault()
  })
}

// Initialize Express
const expressApp = express()

// Pre-route middleware
expressApp.use(cors({
  origin: CORS_ORIGIN,
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'DELETE', 'HEAD'],
  credentials: true
}))

expressApp.use(express.json())
expressApp.use(express.urlencoded({ extended: true }))

// Disable logging when running tests
if (NODE_ENV !== 'test') {
  expressApp.use(morgan('dev'))
}

// Routes
expressApp.use('/api/activities', authenticate as RequestHandler, activityRouter)
expressApp.use('/api/foodItems', authenticate as RequestHandler, foodItemRouter)
expressApp.use('/api/meals', authenticate as RequestHandler, mealRouter)
expressApp.use('/api/mealEntries', authenticate as RequestHandler, mealEntryRouter)
expressApp.use('/api/profiles', authenticate as RequestHandler, profileRouter)

// Post-route middleware
expressApp.use(errorHandler)

function main (): void {
  expressApp.listen(PORT, () => {
    console.log(`listening @ ${PORT}`)
  })
}

export default { main, expressApp }
