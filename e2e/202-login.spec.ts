import { test, expect } from '@playwright/test'

import { TEST_USERS } from './constants.js'

test.describe('Authentication', () => {
  test('Administrator Login', async ({ context, page }) => {
    const testAdministrationUser = TEST_USERS[0]

    await page.goto('http://localhost:3000')

    await expect(page.locator('h4')).toHaveText('Log In')

    // Wrong email and password:

    await page.fill('"Email"', 'bruce.shark@sea.com')
    await page.fill('"Password"', 'bruce')
    await page.click('button:has-text("Log In")')

    await expect(page.locator('.Error')).toHaveText('Wrong email and/or password.')

    // Right email and wrong password:

    await page.fill('"Email"', testAdministrationUser.email)
    await page.click('button:has-text("Log In")')

    await expect(page.locator('.Error')).toHaveText('Wrong email and/or password.')

    // Right email and password:

    await page.fill('"Password"', testAdministrationUser.password)
    await page.click('button:has-text("Log In")')

    await expect(page.locator('h1')).toHaveText('Dashboard')

    await context.storageState({
      path: './e2e/states/administrator.json',
    })
  })
})
