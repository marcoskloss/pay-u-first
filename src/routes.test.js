import request from 'supertest'
import bcrypt from 'bcrypt'

import { prisma } from '~/data'

import { app } from './serverSetup'

const server = app.listen()

describe('User routes', () => {
    beforeEach(async () => {
        await prisma.user.deleteMany({})
    })

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

    it('should return logged in user by correct credentials', async () => {
        const email = 'marcos@email.com'
        const password = '123456'

        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.create({
            data: { email, password: hashedPassword },
        })

        const result = await request(server).get('/login').auth(email, password)

        expect(result.status).toBe(200)
        expect(result.body.user).toBeTruthy()
        expect(result.body.user.id).toBeTruthy()
        expect(result.body.user.email).toBeTruthy()
    })
})
