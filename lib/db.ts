import { PrismaClient } from '@prisma/client'

declare global {
  namespace NodeJS {
    interface Global {
      prisma: any;
    }
  }
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma