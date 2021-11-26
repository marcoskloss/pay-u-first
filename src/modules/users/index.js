import { prisma } from '~/data'
import jwt from 'jsonwebtoken'

export const login = async ctx => {
    try {
        const { email, password } = ctx.request.body
        const [user] = await prisma.user.findMany({
            where: { email, password },
        })

        if (!user) {
            ctx.status = 404
            return
        }

        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)

        ctx.body = { user, token }
    } catch (error) {
        ctx.body = 'Ops! Algo de errado aconteceu!'
        ctx.status = 500
    }
}

export const list = async ctx => {
    const users = await prisma.user.findMany()
    ctx.body = users
}

export const create = async ctx => {
    const user = await prisma.user.create({
        data: {
            ...ctx.request.body,
        },
    })
    ctx.body = user
}

export const update = ctx => {
    ctx.body = 'update'
}

export const remove = ctx => {
    ctx.body = 'remove'
}
