import express, { Request, Response } from 'express'
import cors from 'cors'
import users from './api/v1/users'
import boards from './api/v1/boards'
import todos from './api/v1/todos'
export const setUp = () => {
  const app = express()

  // CORS
  app.use(
    cors({
      origin: [
        'http://localhost:3003',
        'http://localhost:3001',
        'http://localhost:3002',
      ],
      credentials: true,
      optionsSuccessStatus: 200,
    })
  )
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
      return router
    })()
  )
  return app
}
