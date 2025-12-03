import { expect } from '@playwright/test';
import { test } from './auth-utils';
import { PLAYWRIGHT_BASE_URL } from './test-helpers';

test.describe('User profile page', () => {
  test('shows profile summary and recipe sections', async ({ getUserPage }) => {
    const page = await getUserPage('john@foo.com', 'changeme');

    await page.goto(`${PLAYWRIGHT_BASE_URL}/userprofile`);
    await page.waitForLoadState('networkidle');

    const profileCard = page.getByTestId('profile-card');
    await expect(profileCard.getByRole('heading', { name: /Alex Johnson/i })).toBeVisible();
    await expect(profileCard.getByText('alex@example.com')).toBeVisible();
    await expect(profileCard.getByRole('button', { name: 'Edit Profile' })).toBeVisible();

    await expect(page.getByTestId('contributed-heading')).toHaveText('Contributed Recipes');
    await expect(page.getByTestId('contributed-card-1').getByRole('heading', { name: /Toaster Veggie Melt/i })).toBeVisible();
    await expect(page.getByTestId('contributed-card-1').getByRole('button', { name: 'View' })).toBeVisible();
    await expect(page.getByTestId('contributed-card-1').getByRole('button', { name: 'Edit' })).toBeVisible();

    await expect(page.getByTestId('favorite-heading')).toHaveText('Favorite Recipes');
    await expect(page.getByTestId('favorite-card-4').getByRole('heading', { name: /Berry Oat Bars/i })).toBeVisible();
    await expect(page.getByTestId('favorite-card-4').getByRole('button', { name: 'View' })).toBeVisible();
  });
});
