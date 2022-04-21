import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import users from './api/v1/users'
import boards from './api/v1/boards'
import todos from './api/v1/todos'
import auth from './api/v1/auth'
import csrfToken from './api/v1/csrfToken'
import session from 'express-session'
import authPassport, { checkAuthentication } from './authPassport'

const SESSION_SECRET = process.env.SESSION_SECRET || 'yoursecretkeyword'
const PRODUCTION_MODE = process.env.PRODUCTION_MODE || 'dev'

export const setUp = () => {
  const app = express()

  // request.bodyを受ける際に必要
  app.use(express.json())

  // CORS
  app.use(
    cors({
      // TODO: .envに出す
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
      ],
      credentials: true,
      optionsSuccessStatus: 200,
    })
  )

  // クライアント側のCSRF、SESSION で利用
  app.use(cookieParser())

  // trust first proxy
  app.set('trust proxy', 1)
  // dev or production
  const isProduction = PRODUCTION_MODE === 'dev' ? false : true
  app.use(
    session({
      name: 'session',
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      // TODO: sessionの格納先をMySQLに設定
      // store: sessionStore,
      // localhostではなくhttpsが使える環境の場合はPRODUCTION_MODEを変更しtrueで運用する
      // cookie: { secure: isProduction },
      cookie: { secure: false },
    })
  )

  // CSRF sessionの設定後に設定する(先に設定すると'Error: misconfigured csrf'で怒られる)
  app.use(
    csrf({
      cookie: {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'none',
      },
    })
  )

  // passport
  authPassport(app)

  // TODO: ダミーで受付（将来的にはAPIのみで良いので不要になったら消す）
  // checkAuthentication をミドルウェアとして実装する際はsessionが必要
  app.get('/', checkAuthentication, async (req: Request, res: Response) => {
    res.json('hello world')
  })

  app.use(
    '/api/v1',
    (() => {
      const router = express.Router()
      router.use('/users', users)
      router.use('/boards', boards)
      router.use('/todos', todos)
      router.use('/csrf-token', csrfToken)
      router.use('/auth', auth)
      return router
    })()
  )
  return app
}
