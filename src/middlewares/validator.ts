import { check, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

// users
export const checkEmailIsEmpty = check('email')
  .not()
  .isEmpty()
  .withMessage('emailは必須です。')

export const validator = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  console.log(errors.isEmpty())
  if (!errors.isEmpty()) {
    const message = errors.array()
    return res.status(422).json({ isSuccess: false, message: message[0].msg })
  }
  return next()
}
