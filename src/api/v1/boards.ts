import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const boards = Router()
const prisma = new PrismaClient()

boards.route('/').get(async (req, res) => {
  // TODO: 一旦user_idは固定（将来は認証後sessionでuser_idを持つ)
  const boards = await prisma.boards.findMany({
    where: {
      user_id: 1,
    },
  })
  res.json(boards)
})

export default boards
