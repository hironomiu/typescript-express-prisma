import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const users = Router()
const prisma = new PrismaClient()

users.route('/').get(async (req, res) => {
  const allUsers = await prisma.users.findMany()
  console.log(allUsers)
  res.json('users')
})

export default users
