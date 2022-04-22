import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const boards = Router()
const prisma = new PrismaClient()

boards.route('/').get(async (req, res) => {
  // TODO: ログインの状態確認はミドルウェアに入れらる？
  console.log('board session:', req.session)
  if (!req.session.userId) {
    res.json({
      isSuccess: false,
      message: 'access error',
    })
  } else {
    // TODO: 一旦user_idは固定（将来は認証後sessionでuser_idを持つ)
    const boards = await prisma.boards.findMany({
      where: {
        user_id: 1,
      },
    })
    // TODO: isSuccess: true, message: 'success', を追加
    res.json({ isSuccess: true, message: 'success', boards: boards })
  }
})

export default boards
