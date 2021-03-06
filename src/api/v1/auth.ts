import { Router, Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { checkAuthentication } from '../../authPassport'
import passport from 'passport'
import { checkEmailIsEmpty, validator } from '../../middlewares/validator'
const auth = Router()
const prisma = new PrismaClient()

// SignIn状態の確認
auth.get('/signin', checkAuthentication, (req, res) => {
  console.log(req.session)
  // TODO responseで渡す`id` or `userId`について検討
  res.json({
    isSuccess: true,
    id: req.session.userId,
    nickname: req.session.nickname,
    email: req.session.email,
    message: 'success',
  })
})

// req.session.xxx用の型定義
declare module 'express-session' {
  interface Session {
    userId: string
    nickname: string
    email: string
  }
}

// SignIn
auth.post(
  '/signin',
  [checkEmailIsEmpty],
  validator,
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', { session: true }, (err, user, info) => {
      if (err) return next(err)
      // infoではなく別途メッセージをレスポンス
      if (!user)
        return res.status(400).json({ isSuccess: false, message: '認証エラー' })
      // ログイン後のセッションの再作成
      // TODO コールバック内の正常系の処理
      req.session.regenerate((err) => {
        if (err) console.log('err:', err)
      })
      req.session.userId = user.id
      req.session.nickname = user.nickname
      req.session.email = user.email
      // TODO responseで渡す`id` or `userId`について検討
      res.json({ ...user, message: 'signin success' })
      console.log('post signin:', req.session)
      return next()
    })(req, res, next)
  }
)

// SignOut
// TODO: 型
auth.post('/signout', (req: any, res, next) => {
  req.session.destroy()
  res.clearCookie('session')
  return res.json({ isSuccess: true, message: 'signouted' })
})
export default auth
