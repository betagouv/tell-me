import { devices } from '@playwright/test'

import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  globalSetup: './playwright.setup.ts',
  projects: [
    {
      name: 'CHROME DESKTOP',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {
          height: 720,
          width: 1280,
        },
      },
    },
  ],
  testDir: '.',
  timeout: 60000,
  use: {
    bypassCSP: true,
    headless: false,
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
    video: {
      mode: 'on',
      size: {
        height: 720 * 2,
        width: 1280 * 2,
      },
    },
  },
  workers: 1,
}

export default config
