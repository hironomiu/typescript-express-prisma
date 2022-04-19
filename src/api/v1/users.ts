import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const users = Router()
const prisma = new PrismaClient()

const main = async () => {
  const allUsers = await prisma.users.findMany()
  console.log(allUsers)
}

users.route('/').get(async (req, res) => {
  res.json('users')
})

export default users
