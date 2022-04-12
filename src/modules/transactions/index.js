import { Transaction } from './model'
import jwt from 'jsonwebtoken'

export const create = async ctx => {
    if (!ctx.request.headers.authorization) {
        ctx.status = 401
        return
    }

    const [type, token] = ctx.request.headers.authorization.split(' ')

    if (type !== 'Bearer' || !token) {
        ctx.status = 401
        throw new Error()
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    const params = ctx.request.body

    const transaction = await Transaction.create({
        data: { ...params, userId: decodedToken.sub },
    })

    ctx.body = transaction
}
