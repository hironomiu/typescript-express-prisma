import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export const setUp = () => {
  const app = express()
  const prisma = new PrismaClient()

  const main = async () => {
    const allUsers = await prisma.users.findMany()
    console.log(allUsers)
  }
  app.get('/', async (req: Request, res: Response) => {
    main()
    res.json('hello world')
  })

  return app
}
