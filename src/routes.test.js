import request from 'supertest'
import { app } from './serverSetup'

const server = app.listen()

describe('User routes', () => {
    it('given wrong email it should return not found', async () => {
        const email = 'useremail@mai.com'
        const password = '123456'

        const response = await request(server)
            .get('/login')
            .auth(email, password)

        expect(response.status).toBe(404)
    })
    it('given wrong password it should return not found', async () => {
        const email = 'marcos@email.com'
        const password = 'some-password'

        const response = await request(server)
            .get('/login')
            .auth(email, password)

        expect(response.status).toBe(404)
    })
})
