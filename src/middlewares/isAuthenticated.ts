import { Request, Response, NextFunction } from 'express'

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    res.json({ isSuccess: false, message: 'access error' })
  } else {
    return next()
  }
}
