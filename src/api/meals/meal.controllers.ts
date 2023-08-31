import type { NextFunction, Request, Response } from 'express'
import MealRepository from './meal.repository'
import { zMeal, zMealDetails, zMealUpdatableFields, zMeals } from './meal.types'
import { zIdParams, zUserIdParams } from '../../common.types'

export async function getMealByIdController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = zIdParams.parse(req.params)
    const meal = zMeal.parse(await MealRepository.findMealById(id))

    res
      .status(200)
      .json({
        success: true,
        data: {
          meal
        }
      })
  } catch (err: unknown) {
    next(err)
  }
}

export async function getMealsByUserIdController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = zUserIdParams.parse(req.params)
    const userMeals = zMeals.parse(await MealRepository.findMealsByUserId(userId))

    res
      .status(200)
      .json({
        success: true,
        data: {
          userMeals
        }
      })
  } catch (err: unknown) {
    next(err)
  }
}

export async function createMealController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const mealDetails = zMealDetails.parse(req.body)
    const newMeal = zMeal.parse(await MealRepository.createMeal(mealDetails))

    res
      .status(201)
      .json({
        success: true,
        data: {
          newMeal
        }
      })
  } catch (err: unknown) {
    next(err)
  }
}

export async function updateMealController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = zIdParams.parse(req.params)
    const updatedFields = zMealUpdatableFields.parse(req.body)
    const updatedMeal = zMeal.parse(await MealRepository.updateMeal(id, updatedFields))

    res
      .status(200)
      .json({
        success: true,
        data: {
          updatedMeal
        }
      })
  } catch (err: unknown) {
    next(err)
  }
}

export async function deleteMealController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = zIdParams.parse(req.params)

    await MealRepository.deleteMeal(id)

    res
      .status(204)
      .json({
        success: true
      })
  } catch (err: unknown) {
    next(err)
  }
}
