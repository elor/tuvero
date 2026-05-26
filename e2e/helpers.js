import { expect } from '@playwright/test';

export async function waitForApp(page) {
  await page.waitForFunction(() => {
    const splash = document.getElementById('splash');
    return splash && !splash.classList.contains('loading');
  }, { timeout: 10000 });
}

export function collectErrors(page) {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  return errors;
}

export async function goTab(page, tabName) {
  await page.goto(`/basic/#${tabName}`);
  await expect(page.locator(`[data-tab="${tabName}"]`)).toBeVisible();
}

export async function createTournament(page, name) {
  await page.goto('/basic/');
  await waitForApp(page);
  await page.fill('.treename', name);
  await page.click('.createroot.withlabel.big');
}

export async function registerTeams(page, names) {
  for (let i = 0; i < names.length; i++) {
    await page.locator('.newteamview input.playername').first().fill(names[i]);
    await page.locator('.newteamview button.register').click();
    await expect(page.locator('tr.team:not(.template)')).toHaveCount(i + 1);
  }
}

// .system:not(.template) scopes to live tournament views, excluding the static
// template elements that stay in the DOM as cloning sources.
export async function startTournament(page, system) {
  await page.locator(`button[data-system="${system}"]`).click();
  const runBtn = page.locator('.system:not(.template) .initial button.runtournament').first();
  await expect(runBtn).toBeVisible();
  await runBtn.click();
  await expect(page.locator('.system:not(.template).running')).toBeVisible();
}

export async function startNextRound(page) {
  await page.locator('.system:not(.template) .idle button.runtournament').first().click();
  await expect(page.locator('.system:not(.template).running')).toBeVisible();
}

export async function finishAllMatches(page) {
  await goTab(page, 'games');
  const forms = page.locator('[data-tab="games"] .finish');
  while (true) {
    const count = await forms.count();
    if (count === 0) break;
    const form = forms.first();
    await form.locator('input.score').nth(0).fill('1');
    await form.locator('input.score').nth(1).fill('0');
    await form.locator('button.accept').click();
    await expect(forms).not.toHaveCount(count);
  }
}
