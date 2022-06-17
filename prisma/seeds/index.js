import prismaClientPkg from '@prisma/client'
import { B } from 'bhala'

import { generateSurveysMissingKeysAndIds } from './01-generate-surveys-missing-keys-and-ids.js'
import { generateSurveysMissingThankYouMessages } from './02-generate-surveys-missing-thank-you-messages.js'

const { PrismaClient } = prismaClientPkg

const prisma = new PrismaClient()

async function seed() {
  try {
    await generateSurveysMissingKeysAndIds(prisma)
    await generateSurveysMissingThankYouMessages(prisma)
  } catch (err) {
    B.error('[prisma/seeds/index.js]', String(err))
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
