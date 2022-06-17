import { test, expect } from '@playwright/test'
import prismaClientPkg, { UserRole } from '@prisma/client'

import { TEST_USERS } from './constants.js'

const { PrismaClient } = prismaClientPkg

test.describe('Authentication', () => {
  test('First User (= Administrator) Signup', async ({ page }) => {
    const prisma = new PrismaClient()
    const testAdministrationUser = TEST_USERS[0]

    await page.goto('http://localhost:3000')

    await expect(page.locator('h4')).toHaveText('Log In')

    await page.click('button:has-text("sign up")')

    await expect(page.locator('h4')).toHaveText('Sign Up')

    await page.fill('"Your email"', testAdministrationUser.email)
    await page.fill('"A new password"', testAdministrationUser.password)
    await page.fill('"Your new password (again)"', testAdministrationUser.password)
    await page.click('button:has-text("Sign Up")')

    await expect(page.locator('h4')).toHaveText('Log In')

    const userCount = await prisma.user.count()

    if (userCount > 0) {
      await prisma.user.update({
        data: {
          isActive: true,
          role: UserRole.ADMINISTRATOR,
        },
        where: {
          email: testAdministrationUser.email,
        },
      })
    }
  })
})
