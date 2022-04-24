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
            return
        }

        return Promise.reject(error)
    }
}
