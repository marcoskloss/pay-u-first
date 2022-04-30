import bcrypt from 'bcrypt'
import { prisma } from '~/data'

import { generateToken } from '~/modules/users/services'

beforeEach(async () => {
    await prisma.user.deleteMany({})
    await prisma.transaction.deleteMany({})
})

describe('Transaction routes', () => {
    it('should throw error when trying to create a transaction without auth', async () => {
        const response = await global.testRequest.post('/transactions').send({
            description: 'Transaction 123',
            value: '123',
        })

        expect(response.status).toBe(401)
    })

    it('should throw error when trying to create a transaction without correct auth header', async () => {
        const response = await global.testRequest
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

        const response = await global.testRequest
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

        const response = await global.testRequest
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

        const response = await global.testRequest
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

        const response = await global.testRequest
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

        const response = await global.testRequest
            .get('/transactions')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.length).toBe(1)
        expect(response.body[0].id).toBe(transaction.id)
    })
})
