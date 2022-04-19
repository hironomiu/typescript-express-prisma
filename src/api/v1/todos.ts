import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const todos = Router()
const prisma = new PrismaClient()

todos.route('/').get(async (req, res) => {
  // TODO: 一旦user_idは固定（将来は認証後sessionでuser_idを持つ)
  const todos = await prisma.todos.findMany({
    where: {
      user_id: 1,
    },
  })
  res.json(todos)
})

export default todos
