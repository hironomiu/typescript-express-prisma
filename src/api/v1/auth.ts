import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { checkAuthentication } from '../../authPassport'

const auth = Router()
const prisma = new PrismaClient()

// SignIn状態の確認
auth.get('/signin', checkAuthentication, (req, res) => {
  res.json({ isSuccess: true, message: 'success' })
})

// SignIn
auth.route('/signin').post(async (req, res) => {
  console.log(req.body)
})

export default auth
