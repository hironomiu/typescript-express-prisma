import { Router, Request } from 'express'
import { PrismaClient } from '@prisma/client'

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
      orderBy: [{ board_id: 'asc' }, { order_id: 'asc' }],
    })
    res.json(todos)
  }
})

type Todo = {
  id: number
  title: string
  body: string
  userId: number
  boardId: number
  orderId: number
}
interface TodoRequest extends Request {
  body: {
    id: number
    title: string
    body: string
    boardId: number
    orderId: number
    csrfToken: string
  }
}

todos.route('/').post(async (req: TodoRequest, res) => {
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

todos.route('/').put(async (req: TodoRequest, res) => {
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
// TODO: 途中でこけた場合にデータの復旧（board_id,order_idのソート）が必要
todos.route('/all').post(async (req, res) => {
  // MEMO: unique制約回避
  // TODO: unique対策をもう少し考える
  req.body.map(async (data: Todo, index: number) => {
    // TODO: user_idはsessionを使い事前にチェックする
    console.log('all:', data)
    console.log('session user_id:', req.session.userId)
    const updateTodo = await prisma.todos.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        body: data.body,
        // user_id: data.userId,
        board_id: data.boardId,
        order_id: 1000 - index,
      },
    })
  })

  req.body.map(async (data: any) => {
    // TODO: user_idはsessionを使い事前にチェックする
    const updateTodo = await prisma.todos.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        body: data.body,
        // user_id: data.userId,
        board_id: data.boardId,
        order_id: data.orderId,
      },
    })
  })
  // TODO: 処理判定後にレスポンスする
  res.json({ isSuccess: true, message: 'all update success' })
})
export default todos
