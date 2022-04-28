import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { isAuthenticated } from '../../middlewares/isAuthenticated'

const users = Router()
const prisma = new PrismaClient()

// TODO: 認証以外のユーザの利用シーンの実装（認証は別API(auth)で実装済み

users.get('/', isAuthenticated, async (req, res) => {
  const allUsers = await prisma.users.findMany()
  res.json(allUsers)
})

// TODO: isAuthenticated
users.route('/:id').get(async (req, res) => {
  const user = await prisma.users.findUnique({
    where: {
      // id: Number(req.params.id),
      email: 'hanako@example.com',
    },
  })
  res.json(user)
})

export default users
