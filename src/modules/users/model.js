import { prisma } from '~/data'
import bcrypt from 'bcrypt'

const passwordCheck = async (params, next) => {
    const { password: passwordPlainText, ...where } = params.args.where

    params.args.where = where

    const result = await next(params, next)

    if (!result) {
        return result
    }

    const passwordMatch = await bcrypt.compare(
        passwordPlainText,
        result.password
    )

    if (!passwordMatch) return false

    return result
}

prisma.$use(async (params, next) => {
    if (params.model !== 'User' || params.action !== 'findUnique') {
        return next(params, next)
    }

    const result = params.args.where.password
        ? await passwordCheck(params, next)
        : await next(params, next)

    if (result) {
        // eslint-disable-next-line no-unused-vars
        const { password: _, ...user } = result
        return user
    }

    return result
})

export const User = {
    findUnique: prisma.user.findUnique,
    findMany: prisma.user.findMany,
    create: prisma.user.create,
    delete: prisma.user.delete,
    update: prisma.user.update,
}
