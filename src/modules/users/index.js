import bcrypt from 'bcrypt'

import { decodeBasicToken } from './services'
import { User } from './model'
import { generateToken } from './services'

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

        const token = generateToken({ sub: user.id })

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

export const signup = async ctx => {
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

        const token = generateToken({ sub: user.id })

        ctx.body = { user, token }
    } catch (error) {
        ctx.status = 500
        ctx.body = 'Ops! Algo de errado aconteceu!'
    }
}

export const update = async ctx => {
    const { email, name } = ctx.request.body

    try {
        const user = await User.update({
            data: { email, name },
            where: { id: ctx.auth.user.id },
        })
        ctx.body = user
    } catch (error) {
        ctx.status = 500
        ctx.body = 'Ops! Algo de errado aconteceu!'
    }
}

export const remove = async ctx => {
    try {
        await User.delete({
            where: { id: ctx.auth.user.id },
        })
        ctx.body = { id: ctx.auth.user.id }
    } catch (error) {
        ctx.status = 500
        ctx.body = 'Ops! Algo de errado aconteceu!'
    }
}
