import prismaClientPkg from '@prisma/client'
import { B } from 'bhala'

const { PrismaClient } = prismaClientPkg

const prisma = new PrismaClient()

async function seed() {
  // eslint-disable-next-line no-empty
  try {
  } catch (err) {
    B.error('[prisma/seeds/index.js]', String(err))
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
