import { test, expect } from '@playwright/test';
import { PLAYWRIGHT_BASE_URL } from './test-helpers';

test.describe('Recipes page', () => {
  test('lists recipes and filters results via search', async ({ page }) => {
    await page.goto(`${PLAYWRIGHT_BASE_URL}/browse-recipes`);
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Our Recipes' })).toBeVisible();

    const searchInput = page.getByRole('textbox', { name: /search recipes/i });
    await expect(searchInput).toBeVisible();

    await expect(page.getByTestId('recipe-card-1')).toBeVisible();
    await expect(page.getByTestId('recipe-card-2')).toBeVisible();

    await searchInput.fill('Veggie Quesadilla');
    await expect(page.getByTestId('recipe-card-1')).toBeVisible();
    await expect(page.getByTestId('recipe-card-2')).toHaveCount(0);
  });
});
