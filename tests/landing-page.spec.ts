import { test, expect } from '@playwright/test';
import { PLAYWRIGHT_BASE_URL } from './test-helpers';

test.describe('Landing page', () => {
  test('shows hero CTA and Quick Stats', async ({ page }) => {
    await page.goto(PLAYWRIGHT_BASE_URL);
    await page.waitForLoadState('networkidle');

    // Hero section checks
    const heroHeading = page.getByRole('heading', {
      name: /Healthy, Affordable Meals with Just a Toaster Oven/i,
    });
    await expect(heroHeading).toBeVisible();

    await expect(
      page.getByText('Toaster Oven Recipes for Students')
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: 'Sign In to Start Cooking' })
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: 'Browse Recipes' })
    ).toBeVisible();

    await expect(page.getByRole('list')).toContainText(
      'Toaster oven-friendly recipes'
    );

    // Quick Stats checks
    const quickStatsSection = page.getByTestId('quick-stats-section');

    await expect(
      quickStatsSection.getByRole('heading', { name: /Quick Stats/i })
    ).toBeVisible();

    // We only assert on labels/text so counts can change freely
    await expect(
      quickStatsSection.getByTestId('stat-recipes')
    ).toContainText('Recipes');

    await expect(
      quickStatsSection.getByTestId('stat-visits')
    ).toContainText('Visits');

    await expect(
      quickStatsSection.getByTestId('stat-users')
    ).toContainText('User Profiles');

    await expect(
      quickStatsSection.getByTestId('stat-reviews')
    ).toContainText('Reviews');
  });
});
