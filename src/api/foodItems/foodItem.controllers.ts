import type { NextFunction, Request, Response } from 'express'
import FoodItemRepository from './foodItem.repository'
import { zFoodItem, zFoodItemDetails, zFoodItemUpdatableFields } from './foodItem.types'
import { zIdParams, zUserIdParams } from '../../common.types'

export async function getFoodItemController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = zIdParams.parse(req.params)
    const foodItem = await FoodItemRepository.findFoodItemById(id)

    res.status(200)
      .json({
        success: true,
        data: {
          foodItem
        }
      })
  } catch (error: unknown) {
    next(error)
  }
}

export async function getFoodItemsOfUserController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = zUserIdParams.parse(req.params)
    const userFoodItems = await FoodItemRepository.findFoodItemsByUserId(userId)

    res.status(200)
      .json({
        success: true,
        data: {
          userFoodItems
        }
      })
  } catch (error: unknown) {
    next(error)
  }
}

export async function createFoodItemController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const foodItemDetails = zFoodItemDetails.parse(req.body)
    const newFoodItem = await FoodItemRepository.createFoodItem({ ...foodItemDetails })

    res.status(201)
      .json({
        success: true,
        data: {
          newFoodItem
        }
      })
  } catch (error: unknown) {
    next(error)
  }
}

export async function updateFoodItemController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = zIdParams.parse(req.params)
    const updatedFields = zFoodItemUpdatableFields.parse(req.body)
    const updatedFoodItem = zFoodItem.parse(await FoodItemRepository.updateFoodItem(id, updatedFields))

    res.status(200)
      .json({
        success: true,
        data: {
          updatedFoodItem
        }
      })
  } catch (error: unknown) {
    next(error)
  }
}

export async function deleteFoodItemController (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = zIdParams.parse(req.params)

    await FoodItemRepository.deleteFoodItem(id)

    res.status(204)
      .json({
        success: true
      })
  } catch (error: unknown) {
    next(error)
  }
}
