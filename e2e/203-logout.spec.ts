import { test, expect } from '@playwright/test'

import { TEST_USERS } from './constants.js'

test.describe('Authentication', () => {
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('Administration User Logout', async ({ context, page }) => {
    const testAdministrationUser = TEST_USERS[0]

    await page.goto('http://localhost:3000')

    await expect(page.locator('h1')).toHaveText('Dashboard')

    await page.click('[aria-label="Log out"]')

    await expect(page.locator('h4')).toHaveText('Log In')

    // We log in again to prepare next authenticated tests:

    await page.fill('"Email"', testAdministrationUser.email)
    await page.fill('"Password"', testAdministrationUser.password)
    await page.click('button:has-text("Log In")')

    await expect(page.locator('h1')).toHaveText('Dashboard')

    await context.storageState({
      path: './e2e/states/administrator.json',
    })
  })
})
