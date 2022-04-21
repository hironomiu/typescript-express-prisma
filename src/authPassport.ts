import { Express, NextFunction, Response } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import { PrismaClient, users } from '@prisma/client'

// import { findByEmailAuth } from './models/User'
type UserAuth = {
  id: number
  nickname: string
  email: string
  password: string
  // created_at: Date
  // updated_at: Date
}

const prisma = new PrismaClient()

const authPassport = (app: Express) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await prisma.users.findUnique({
            where: {
              email: email,
            },
          })
          if (!user)
            return done(null, { isSuccess: false, message: '認証エラー' })

          const isValid = await new Promise((resolve, reject) =>
            bcrypt.compare(password, user.password, (err, isValid) => {
              resolve(isValid)
            })
          )

          if (email !== user.email) {
            return done(null, { isSuccess: false, message: '認証エラー' })
          } else if (!isValid) {
            return done(null, { isSuccess: false, message: '認証エラー' })
          } else {
            return done(null, {
              isSuccess: true,
              id: user.id,
              nickname: user.nickname,
              email: user.email,
            })
          }
          // DBエラーをキャッチ
        } catch (err) {
          console.log(err)
          return done(null, { isSuccess: false, message: '認証エラー' })
        }
      }
    )
  )
}

// TODO reqの型は以下では定義できなかった
// interface User {}
// interface AuthenticatedRequest extends Request {
//   user: User
// }

export const checkAuthentication = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  // TODO req.isAuthenticated()では常にfalseになる理由について
  // if (req.isAuthenticated()) {
  if (req.session.userId) {
    next()
  } else {
    res.status(400).json({ isSuccess: false, message: 'false' })
  }
}
export default authPassport
