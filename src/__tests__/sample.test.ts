import supertest from 'supertest'
import { Express } from 'express'
import { setUp } from '../app'

let app: Express

beforeEach(() => {
  app = setUp()
})

afterAll(() => {})

describe('sample', () => {
  it('test', async () => {
    const response = await supertest(app).get('/api/v1/users')
    const data = JSON.parse(response.text)
    expect(data[0].id).toBe(1)
  })
})
