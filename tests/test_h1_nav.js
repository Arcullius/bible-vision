const { test, expect } = require('@playwright/test');

test('homepage has correct h1, nav', async ({ page }, testInfo) => {
  await page.goto('/');
  const h1 = page.locator('h1');
  const nav = page.locator('nav ul li a');
  await expect(nav.nth(0)).toHaveText('Home');
  await expect(nav.nth(1)).toHaveText('Notes');
  await expect(nav.nth(2)).toHaveText('About');
  await expect(h1).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath('homepage_h1_nav.png'),
    fullpage: true,
  });
});