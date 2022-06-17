import { Prisma } from '@prisma/client'
import { Transaction } from './model'

export const create = async ctx => {
    try {
        const params = ctx.request.body

        const transaction = await Transaction.create({
            data: { ...params, userId: ctx.auth.user.id },
        })

        ctx.body = transaction
    } catch (error) {
        if (error instanceof Prisma.PrismaClientValidationError) {
            ctx.status = 400
            ctx.body = { error: 'Dados da transação são inválidos' }
            return
        }

        return Promise.reject(error)
    }
}

export const list = async ctx => {
    const transactions = await Transaction.findMany({
        where: { userId: ctx.auth.user.id },
    })

    ctx.body = transactions
}

export const update = async ctx => {
    const { description, value } = ctx.request.body
    await Transaction.updateMany({
        data: { description, value },
        where: { id: ctx.params.id, userId: ctx.auth.user.id },
    })
    ctx.body = { id: ctx.params.id }
}

export const remove = async ctx => {
    await Transaction.deleteMany({
        where: {
            id: ctx.params.id,
            userId: ctx.auth.user.id,
        },
    })

    ctx.body = { id: ctx.params.id }
}
