import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const auth = Router()
const prisma = new PrismaClient()

// SignIn
auth.route('/signin').post(async (req, res) => {
  console.log(req.body)
})

export default auth
