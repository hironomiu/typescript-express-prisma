import supertest from 'supertest'
import { Express } from 'express'
import { setUp } from '../app'

let app: Express = setUp()
let csrfToken = ''
let cookie = ''

beforeEach(async () => {
  const response = await supertest(app).get('/api/v1/csrf-token')
  const obj = JSON.parse(response.text)
  csrfToken = obj.csrfToken
  const data = response.headers['set-cookie'][0]
  const text = data.split(';')
  cookie = text[0]
})

afterAll(() => {})

describe('auth', () => {
  it('POST /signin', async () => {
    const user = {
      nickname: 'taro',
      email: 'taro@example.com',
      password: 'password',
    }
    const response = await supertest(app)
      .post('/api/v1/auth/signin')
      .set('Accept', 'application/json')
      .set('CSRF-Token', csrfToken)
      .set('Cookie', [cookie])
      .send(user)
    const obj = JSON.parse(response.text)
    expect(response.status).toBe(200)
    expect(obj.isSuccess).toBe(true)
    expect(obj.message).toBe('signin success')
  })
})
