import { prisma } from '~/data'

export const Transaction = {
    create: prisma.transaction.create,
    findMany: prisma.transaction.findMany,
}
