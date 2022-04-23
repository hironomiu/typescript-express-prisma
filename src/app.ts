import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import users from './api/v1/users'
import boards from './api/v1/boards'
import todos from './api/v1/todos'
import auth from './api/v1/auth'
import csrfToken from './api/v1/csrfToken'
import * as expressSession from 'express-session'
import expressMySqlSession from 'express-mysql-session'
import session from 'express-session'
import authPassport, { checkAuthentication } from './authPassport'
import mysql2 from 'mysql2/promise'

const SESSION_SECRET = process.env.SESSION_SECRET || 'yoursecretkeyword'
const PRODUCTION_MODE = process.env.PRODUCTION_MODE || 'dev'
const DB_DATABASE = process.env.DB_DATABASE || 'dnd'
const DB_HOST = process.env.DB_HOST || '127.0.0.1'
const DB_PASSWORD = process.env.DB_PASSWORD || 'mysql'
const DB_PORT = process.env.DB_PORT || '3306'
const DB_USER = process.env.DB_USER || 'root'
const CORS_URLS = process.env.CORS_URLS?.split(' ') || ['http://localhost:3000']

const options = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'mysql',
  database: 'dnd',
}

// expressMySqlSessionを利用する際にcaching_sha2_passwordで怒られないようmysql2をラップする
const connection = mysql2.createPool(options)
const MySQLStore = expressMySqlSession(expressSession)

export const sessionStore = new MySQLStore({}, connection)

export const setUp = () => {
  const app = express()

  // request.bodyを受ける際に必要
  app.use(express.json())

  // CORS
  app.use(
    cors({
      origin: CORS_URLS,
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
      // TODO: mysql2 sessionStoreを使うとsessionが安定しない
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
