import { prisma } from '~/data'

export const Transaction = {
    create: prisma.transaction.create,
}
