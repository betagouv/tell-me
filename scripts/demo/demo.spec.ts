import { test, expect } from '@playwright/test'

import { DEMO_USER } from './constants.js'
import { typeSentence } from './helpers.js'

test('Demo', async ({ page }) => {
  await page.goto('http://localhost:3000')

  await page.type('"Email"', DEMO_USER.email, { delay: 50 })
  await page.waitForTimeout(500)
  await page.type('"Password"', DEMO_USER.password, { delay: 50 })
  await page.waitForTimeout(500)
  await page.click('button:has-text("Log In")')

  await expect(page.locator('h1')).toHaveText('Dashboard')

  await page.click('a:has-text("Surveys")')

  await expect(page.locator('h1')).toHaveText('Surveys')

  await page.click('button:has-text("New survey")')

  await expect(page.locator('h1')).toHaveText(/^New Survey Title #\d+$/)

  await page.keyboard.press('Enter')
  await page.keyboard.press('/', { delay: 500 })
  await page.keyboard.down('Enter')
  await page.waitForTimeout(250)
  await typeSentence(page, "Isn't Tell Me the best TMS ever?")
  await page.keyboard.press('Enter', { delay: 250 })
  await page.keyboard.press('/', { delay: 250 })
  await typeSentence(page, 'choice')
  await page.waitForTimeout(500)
  await page.keyboard.down('ArrowDown')
  await page.waitForTimeout(500)
  await page.keyboard.press('Enter', { delay: 250 })
  await typeSentence(page, 'Yes')
  await page.keyboard.press('Enter', { delay: 250 })
  await typeSentence(page, 'No')
})
