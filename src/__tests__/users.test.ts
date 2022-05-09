import supertest from 'supertest'
import { Express } from 'express'
import { setUp, sessionStore } from '../app'

let app: Express = setUp()

afterAll(() => sessionStore.close())
// TODO: usersの実装にあわせて修正
describe('users', () => {
  it('test', async () => {
    const response = await supertest(app).get('/api/v1/users/1')
    const data = JSON.parse(response.text)
    expect(data.id).toBe(2)
    expect(data.nickname).toBe('花子')
  })
})
