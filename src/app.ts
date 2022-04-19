import express, { Request, Response } from 'express'
import users from './api/v1/users'
export const setUp = () => {
  const app = express()

  app.get('/', async (req: Request, res: Response) => {
    res.json('hello world')
  })

  app.use(
    '/api/v1',
    (() => {
      const router = express.Router()
      router.use('/users', users)
      return router
    })()
  )
  return app
}
