import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { isAuthenticated } from '../../middlewares/isAuthenticated'

const boards = Router()
const prisma = new PrismaClient()

boards.get('/', isAuthenticated, async (req, res) => {
  console.log('board session:', req.session)
  const boards = await prisma.boards.findMany({
    where: {
      user_id: 1,
    },
  })
  res.json({ isSuccess: true, message: 'success', boards: boards })
})

export default boards
