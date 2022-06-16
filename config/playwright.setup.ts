/* eslint-disable no-await-in-loop */

import prismaClientPkg from '@prisma/client'
import dotenv from 'dotenv'

import { TEST_USERS } from '../e2e/constants.js'

dotenv.config()

const { CI } = process.env
const IS_CI = Boolean(CI)

const { PrismaClient } = prismaClientPkg

export default async function globalSetup() {
  if (IS_CI) {
    return
  }

  const prisma = new PrismaClient()

  for (const testUser of TEST_USERS) {
    const user = await prisma.user.findUnique({
      where: {
        email: testUser.email,
      },
    })

    if (user === null) {
      continue
    }

    await prisma.personalAccessToken.deleteMany({
      where: {
        userId: user.id,
      },
    })

    await prisma.survey.deleteMany({
      where: {
        userId: user.id,
      },
    })

    await prisma.refreshToken.deleteMany({
      where: {
        userId: user.id,
      },
    })

    await prisma.user.delete({
      where: {
        email: testUser.email,
      },
    })
  }

  await prisma.$disconnect()
}
