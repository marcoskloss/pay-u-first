import request from 'supertest'
import bcrypt from 'bcrypt'

import { prisma } from './data'

import { app } from './serverSetup'
import { generateToken, verifyToken } from '~/modules/users/services'

const server = app.listen()

afterAll(async () => {
    server.close()
})

beforeEach(async () => {
    await prisma.user.deleteMany({})
    await prisma.transaction.deleteMany({})
})

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

        const decodedToken = verifyToken(response.body.token)

        expect(response.status).toBe(200)
        expect(response.body.user.id).toBe(user.id)
        expect(response.body.user.email).toBe(user.email)
        expect(response.body.user.password).toBeFalsy()
        expect(decodedToken.sub).toBe(user.id)
    })

    it('should update the logged in user data', async () => {
        const email = 'marcos@email.com'
        const password = '123456'

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        })

        const token = generateToken({ sub: user.id })
        const newEmail = 'marcos+1@mail.com'

        const response = await request(server)
            .put('/me')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: newEmail })

        expect(response.status).toBe(200)
        expect(response.body).toEqual(
            expect.objectContaining({ email: newEmail })
        )
    })

    it('should delete the logged in user', async () => {
        const email = 'marcos@email.com'
        const password = '123456'

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        })

        const token = generateToken({ sub: user.id })

        const response = await request(server)
            .delete('/me')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        await expect(
            prisma.user.findUnique({ where: { id: user.id } })
        ).resolves.toBeNull()
    })
})

describe('Transaction routes', () => {
    it('should throw error when trying to create a transaction without auth', async () => {
        const response = await request(server).post('/transactions').send({
            description: 'Transaction 123',
            value: '123',
        })

        expect(response.status).toBe(401)
    })

    it('should throw error when trying to create a transaction without correct auth header', async () => {
        const response = await request(server)
            .post('/transactions')
            .set('Bearer', '')
            .send({
                description: 'Transaction 123',
                value: '123',
            })

        expect(response.status).toBe(401)
    })

    it('should create a transaction for logged in user', async () => {
        const email = 'marcos@email.com'
        const password = '123456'

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        })

        const token = generateToken({ sub: user.id })

        const transactionData = {
            description: 'Transaction 123',
            value: '123',
        }

        const response = await request(server)
            .post('/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send(transactionData)

        expect(response.status).toBe(200)
        expect(response.body.id).toEqual(expect.any(String))
        expect(response.body.value).toBe(transactionData.value)
        expect(response.body.description).toBe(transactionData.description)
    })

    it('should return 401 when trying to create a transaction with invalid token', async () => {
        const token = 'abc'

        const transactionData = {
            description: 'Transaction 123',
            value: '123',
        }

        const response = await request(server)
            .post('/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send(transactionData)

        expect(response.status).toBe(401)
    })

    it('should return 400 when trying to create a transaction without value', async () => {
        const email = 'marcos@email.com'
        const password = '123456'

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        })

        const token = generateToken({ sub: user.id })

        const transactionData = {
            description: 'Transaction 123',
        }

        const response = await request(server)
            .post('/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send(transactionData)

        expect(response.status).toBe(400)
    })

    it('should return 400 when trying to create a transaction without description', async () => {
        const email = 'marcos@email.com'
        const password = '123456'

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        })

        const token = generateToken({ sub: user.id })

        const transactionData = {
            value: '12',
        }

        const response = await request(server)
            .post('/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send(transactionData)

        expect(response.status).toBe(400)
    })

    it('should return the transactions of a given user', async () => {
        const password = '123456'

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { email: 'a@mail.com', password: hashedPassword },
        })
        const user2 = await prisma.user.create({
            data: { email: 'b@mail.com', password: hashedPassword },
        })

        const token = generateToken({ sub: user.id })

        const transaction = await prisma.transaction.create({
            data: {
                description: 'foo',
                value: '42',
                userId: user.id,
            },
        })

        await prisma.transaction.create({
            data: {
                description: 'description',
                value: '123',
                userId: user2.id,
            },
        })

        const response = await request(server)
            .get('/transactions')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.length).toBe(1)
        expect(response.body[0].id).toBe(transaction.id)
    })
})
