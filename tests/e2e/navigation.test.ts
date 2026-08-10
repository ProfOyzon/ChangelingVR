import { instant } from '@next/playwright';
import { expect, test } from '@playwright/test';

test.describe('Instant navigation', () => {
  test('loads the teams page instantly', async ({ page, baseURL }) => {
    await instant(
      page,
      async () => {
        await page.goto('/teams');
        await expect(page.locator('h1')).toContainText('Meet the Team');
        await expect(page.getByPlaceholder('Search for a team member')).toBeVisible();
      },
      { baseURL },
    );
  });

  test('navigates instantly from a team member to their user page', async ({ page }) => {
    await page.goto('/teams');
    await page.getByPlaceholder('Search for a team member').fill('elouiseoyzon');

    await instant(page, async () => {
      await page.click('a[href="/users/elouiseoyzon"]');
      await page.waitForURL((url) => url.pathname === '/users/elouiseoyzon');
      await expect(page.locator('button[aria-label="Back to Teams"]')).toBeVisible();
    });

    await expect(page.getByText('@elouiseoyzon', { exact: true })).toBeVisible();
  });
});
