import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const users = Router()
const prisma = new PrismaClient()

users.route('/').get(async (req, res) => {
  const allUsers = await prisma.users.findMany()
  res.json(allUsers)
})

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
