import type { Page } from '@playwright/test'

export async function typeSequence(page: Page, keys: string[]) {
  await Promise.all(
    keys.map(async key => {
      await page.keyboard.press(key)
    }),
  )
}

export async function typeSentence(page: Page, sentence: string) {
  const letters = sentence.split('')

  for (const letter of letters) {
    await page.keyboard.press(letter, { delay: 100 })
  }
}
