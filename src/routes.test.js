import request from 'supertest'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { prisma } from '~/data'

import { app } from './serverSetup'

const server = app.listen()

afterAll(async () => {
    server.close()
})

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

        await prisma.user.create({
            data: { email, password: 'fake-pass' },
        })

        const response = await request(server)
            .get('/login')
            .auth(email, password)

        expect(response.status).toBe(404)
    })

    it('should return logged in user by correct credentials', async () => {
        const email = 'marcos@email.com'
        const password = '123456'

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        })

        const response = await request(server)
            .get('/login')
            .auth(email, password)
        const decodedToken = jwt.verify(
            response.body.token,
            process.env.JWT_SECRET
        )

        expect(response.status).toBe(200)
        expect(response.body.user.id).toBe(user.id)
        expect(response.body.user.email).toBe(user.email)
        expect(response.body.user.password).toBeFalsy()
        expect(decodedToken.sub).toBe(user.id)
    })
})
