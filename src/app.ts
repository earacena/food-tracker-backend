import express from 'express'
import { PORT } from './config'
import foodItemRouter from './api/foodItems/foodItem.routes'
import errorHandler from './middleware/errorHandler.middleware'
import mealRouter from './api/meals/meal.routes'

const expressApp = express()

// Pre-route middleware
expressApp.use(express.json())

// Routes
expressApp.use('/api/foodItems', foodItemRouter)
expressApp.use('/api/meals', mealRouter)

// Post-route middleware
expressApp.use(errorHandler)

function main (): void {
  expressApp.listen(PORT, () => {
    console.log(`listening @ ${PORT}`)
  })
}

export default { main, expressApp }
