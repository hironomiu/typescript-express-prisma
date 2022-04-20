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
  // TODO: 更新処理の実装（一旦user_idの確認はせずに更新する）
  const updateTodo = await prisma.todos.update({
    where: {
      id: req.body.id,
    },
    data: {
      title: req.body.title,
      body: req.body.body,
      board_id: req.body.boardId,
      order_id: req.body.orderId,
    },
  })
  console.log('update:', req.body)
  res.json({ isSuccess: true, message: 'put success' })
})

export default todos
