import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const boards = Router()
const prisma = new PrismaClient()

boards.route('/').get(async (req, res) => {
  const boards = await prisma.boards.findMany({
    where: {
      user_id: 1,
    },
  })
  res.json(boards)
})

export default boards
