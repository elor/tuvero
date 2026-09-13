import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  // Serial on purpose: the vite dev server resolves the variant
  // aliases (options/presets/strings) via "variant of the most
  // recent browser request" (see variantAliasPlugin). Parallel tests
  // loading different variants race that state and can be served the
  // wrong variant's modules — observed as spurious failures (e.g. a
  // disabled accept button) that never reproduce in isolation.
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: Number(process.env.SLOWMO ?? 0)
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true
  }
})
