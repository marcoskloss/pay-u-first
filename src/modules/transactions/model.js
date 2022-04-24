import { prisma } from '../../data'

export const Transaction = {
    create: prisma.transaction.create,
    findMany: prisma.transaction.findMany,
    update: prisma.transaction.update,
    updateMany: prisma.transaction.updateMany,
}
