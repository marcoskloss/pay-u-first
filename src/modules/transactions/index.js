import { Transaction } from './model'

export const create = async ctx => {
    if (!ctx.request.headers.authorization) {
        ctx.status = 401
        return
    }

    const [type, token] = ctx.request.headers.authorization.split(' ')

    if (type !== 'Bearer' || !token) {
        throw new Error()
    }

    const params = ctx.request.body

    const transaction = await Transaction.create({
        data: params,
    })

    ctx.body = transaction
}
