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
  await page.waitForTimeout(100);
}

export async function createTournament(page, name) {
  await page.goto('/basic/');
  await waitForApp(page);
  await page.fill('.treename', name);
  await page.click('.createroot.withlabel.big');
}

// Register teams by name using the teams tab form (one at a time)
export async function registerTeams(page, names) {
  for (const name of names) {
    await page.locator('.newteamview input.playername').first().fill(name);
    await page.locator('.newteamview button.register').click();
    await page.waitForTimeout(100);
  }
}

// Click the system button to create a new tournament, then start the first round
export async function startTournament(page, system) {
  await page.locator(`button[data-system="${system}"]`).click();
  await page.waitForTimeout(200);
  await page.locator('.initial button.runtournament').click();
  await page.waitForTimeout(200);
}

// Start the next round for an already-created tournament (idle state)
export async function startNextRound(page) {
  await page.locator('.idle button.runtournament').click();
  await page.waitForTimeout(200);
}

// Finish every running match in the games tab with score 1:0
export async function finishAllMatches(page) {
  await goTab(page, 'games');
  await page.waitForTimeout(300);
  while (true) {
    const form = page.locator('[data-tab="games"] .finish').first();
    if (await form.count() === 0) break;
    await form.locator('input.score').nth(0).fill('1');
    await form.locator('input.score').nth(1).fill('0');
    await form.locator('button.accept').click();
    await page.waitForTimeout(300);
  }
}
