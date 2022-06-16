import { test, expect } from '@playwright/test'

test.describe('Sanity Check', () => {
  test('API', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api')
    const data = await response.json()

    expect(response.ok()).toBe(true)
    expect(data).toMatchObject({
      data: {
        isReady: false,
        version: '0.0.0',
      },
    })
  })

  test('Home', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page.locator('h4')).toHaveText('Log In')
  })
})
