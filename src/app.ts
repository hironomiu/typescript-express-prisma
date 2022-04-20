import express, { Request, Response } from 'express'
import cors from 'cors'
import users from './api/v1/users'
import boards from './api/v1/boards'
import todos from './api/v1/todos'
import auth from './api/v1/auth'
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

  // TODO: ダミーで受付（将来的にはAPIのみで良いので不要になったら消す）
  app.get('/', async (req: Request, res: Response) => {
    res.json('hello world')
  })

  app.use(
    '/api/v1',
    (() => {
      const router = express.Router()
      router.use('/users', users)
      router.use('/boards', boards)
      router.use('/todos', todos)
      router.use('/auth', auth)
      return router
    })()
  )
  return app
}
