import prismaClientPkg from '@prisma/client'
import { B } from 'bhala'

import { generateSurveysMissingKeysAndIds } from './01-generate-surveys-missing-keys-and-ids.js'

const { PrismaClient } = prismaClientPkg

const prisma = new PrismaClient()

async function seed() {
  try {
    await generateSurveysMissingKeysAndIds(prisma)
  } catch (err) {
    B.error('[prisma/seeds/index.js]', String(err))
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
