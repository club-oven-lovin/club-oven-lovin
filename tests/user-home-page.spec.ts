import { expect } from '@playwright/test';
import { test } from './auth-utils';
import { PLAYWRIGHT_BASE_URL } from './test-helpers';

test.describe('User home page', () => {
  test('shows hero, quick actions, and recommendations', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');

    await page.goto(`${PLAYWRIGHT_BASE_URL}/user-home-page`);
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: /Hey/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Browse recipes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share a new dish' })).toBeVisible();

    const quickActionsHeading = page.getByRole('heading', {
      name: 'Stay in flow with one-tap tasks',
    });
    await expect(quickActionsHeading).toBeVisible();
    await expect(page.getByRole('button', { name: 'Launch' })).toHaveCount(3);

    await expect(
      page.getByRole('heading', { name: 'Fresh ideas curated for you' })
    ).toBeVisible();
    await expect(page.getByText('Classic Margherita Pizza')).toBeVisible();
  });
});
