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

todos.route('/').put(async (req, res) => {
  // TODO: 更新処理の実装（一旦user_idは固定で更新する）
  // const todos = await prisma.todos.findMany({
  //   where: {
  //     user_id: 1,
  //   },
  // })
  console.log('update')
  res.json({ isSuccess: true, message: 'put success' })
})

export default todos
