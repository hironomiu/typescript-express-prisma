import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { userInfo } from 'os'

const todos = Router()
const prisma = new PrismaClient()

todos.route('/').get(async (req, res) => {
  // TODO: ミドルウェア化
  if (!req.session.userId) {
    res.json({ isSuccess: false, message: 'access error' })
  } else {
    const todos = await prisma.todos.findMany({
      where: {
        user_id: Number(req.session.userId),
      },
    })
    res.json(todos)
  }
})

todos.route('/').post(async (req, res) => {
  console.log('post:', req.body)
  // TODO: ミドルウェア化
  if (!req.session.userId) {
    res.json({ isSuccess: false, message: 'access error' })
  } else {
    const maxOrderId = await prisma.todos.aggregate({
      where: {
        user_id: Number(req.session.userId),
        board_id: req.body.boardId,
      },
      _max: {
        order_id: true,
      },
    })

    console.log(maxOrderId._max.order_id)

    const orderId = Number(maxOrderId._max.order_id) + 1
    const insertTodo = await prisma.todos.create({
      data: {
        title: req.body.title,
        body: req.body.body,
        user_id: Number(req.session.userId),
        board_id: req.body.boardId,
        order_id: orderId,
      },
    })

    console.log(insertTodo)
    res.json({ isSuccess: true, message: 'post success', data: insertTodo })
  }
})

todos.route('/').put(async (req, res) => {
  // TODO: ミドルウェア化
  if (!req.session.userId) {
    res.json({ isSuccess: false, message: 'access error' })
  } else {
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
  }
})

// TODO: エンドポイント名
todos.route('/all').post(async (req, res) => {
  console.log(req.body)
})
export default todos
