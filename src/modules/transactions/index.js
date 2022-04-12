import { Transaction } from './model'

export const create = async ctx => {
    const params = ctx.request.body

    const transaction = await Transaction.create({
        data: params,
    })

    ctx.body = transaction
}
