import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { decodeBasicToken } from './services'
import { User } from './model'

export const login = async ctx => {
    try {
        const [email, password] = decodeBasicToken(
            ctx.request.headers.authorization
        )

        const user = await User.findUnique({
            where: { email, password },
        })

        if (!user) {
            ctx.status = 404
            return
        }

        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)

        ctx.body = { user, token }
    } catch (error) {
        if (error.custom) {
            ctx.status = 400
            return
        }

        console.log(error)
        ctx.body = 'Ops! Algo de errado aconteceu!'
        ctx.status = 500
    }
}

export const list = async ctx => {
    const users = await User.findMany()
    ctx.body = users
}

export const create = async ctx => {
    try {
        const salt = 10
        const hashedPassword = await bcrypt.hash(
            ctx.request.body.password,
            salt
        )

        const user = await User.create({
            data: {
                name: ctx.request.body.name,
                email: ctx.request.body.email,
                password: hashedPassword,
            },
        })

        ctx.body = user
    } catch (error) {
        ctx.status = 500
        ctx.body = 'Ops! Algo de errado aconteceu!'
    }
}

export const update = ctx => {
    ctx.body = 'update'
}

export const remove = ctx => {
    ctx.body = 'remove'
}
