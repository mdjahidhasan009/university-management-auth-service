import { NextFunction, Request, RequestHandler, Response } from 'express'

import { UserService } from './user.service'

const createUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req.body
    const result = await UserService.createUser(user)
    res.status(200).json({
      success: true,
      message: 'User created successfully',
      data: result,
    })
  } catch (e) {
    next(e)
  }
}

export const UserController = {
  createUser,
}
