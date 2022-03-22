import { prisma } from '~/data'
import bcrypt from 'bcrypt'

async function findUnique(params) {
    const { password: passwordPlainText, ...where } = params.where

    const result = await prisma.user.findUnique({ ...params, where })

    if (!result || !passwordPlainText) {
        return result
    }

    const passwordMatch = await bcrypt.compare(
        passwordPlainText,
        result.password
    )

    if (!passwordMatch) {
        return false
    }

    const { password: _, ...user } = result

    return user
}

export const User = {
    findUnique,
    findMany: prisma.user.findMany,
    create: prisma.user.create,
    delete: prisma.user.delete,
    update: prisma.user.update,
}
