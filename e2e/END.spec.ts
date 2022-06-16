import { expect, test } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { B } from 'bhala'

import { TEST_USERS } from './constants.js'

test.describe('END', () => {
  test('END', async () => {
    expect(1 + 1).toBe(2)
  })

  test.afterAll(async () => {
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

    const userCount = await prisma.user.count()
    B.info(`\n${userCount} user(s) left.`)

    await prisma.$disconnect()
  })
})
