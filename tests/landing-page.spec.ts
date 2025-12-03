import { test, expect } from '@playwright/test';
import { PLAYWRIGHT_BASE_URL } from './test-helpers';

test.describe('Landing page', () => {
  test('shows hero CTA and Quick Stats', async ({ page }) => {
    await page.goto(PLAYWRIGHT_BASE_URL);
    await page.waitForLoadState('networkidle');

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
    await expect(page.getByRole('link', { name: 'Browse Recipes' })).toBeVisible();
    await expect(page.getByRole('list')).toContainText('Toaster oven-friendly recipes');

    const quickStatsSection = page.getByTestId('quick-stats-section');
    await expect(
      quickStatsSection.getByRole('heading', { name: /Quick Stats/i })
    ).toBeVisible();
    await expect(
      quickStatsSection.getByTestId('stat-recipes')
    ).toContainText('Recipes');
    await expect(
      quickStatsSection.getByTestId('stat-visits')
    ).toContainText('Visits');
    await expect(
      quickStatsSection.getByTestId('stat-average-price')
    ).toContainText('Average price');
    await expect(
      quickStatsSection.getByTestId('stat-reviews')
    ).toContainText('Reviews');
  });
});
