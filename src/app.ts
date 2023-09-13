import express from 'express'
import { PORT } from './config'
import foodItemRouter from './api/foodItems/foodItem.routes'
import errorHandler from './middleware/errorHandler.middleware'
import mealRouter from './api/meals/meal.routes'
import mealEntryRouter from './api/mealEntries/mealEntry.routes'
import authenticate from './middleware/authenticate'
import profileRouter from './api/profiles/profile.routes'
import activityRouter from './api/activities/activity.routes'

const expressApp = express()

// Pre-route middleware
expressApp.use(express.json())

// Routes
expressApp.use('/api/activities', authenticate, activityRouter)
expressApp.use('/api/foodItems', authenticate, foodItemRouter)
expressApp.use('/api/meals', authenticate, mealRouter)
expressApp.use('/api/mealEntries', authenticate, mealEntryRouter)
expressApp.use('/api/profiles', authenticate, profileRouter)

// Post-route middleware
expressApp.use(errorHandler)

function main (): void {
  expressApp.listen(PORT, () => {
    console.log(`listening @ ${PORT}`)
  })
}

export default { main, expressApp }
