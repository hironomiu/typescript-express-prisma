import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const todos = Router()
const prisma = new PrismaClient()

todos.route('/').get(async (req, res) => {
  const todos = await prisma.todos.findMany({
    where: {
      user_id: 1,
    },
  })
  res.json(todos)
})

export default todos
