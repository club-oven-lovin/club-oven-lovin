import { test, expect } from '@playwright/test';

test.describe('Recipes page', () => {
  test('lists recipes and filters results via search', async ({ page }) => {
    await page.goto('/browse-recipes');

    const searchInput = page.getByRole('textbox', { name: /search recipes/i });
    await expect(searchInput).toBeVisible();

    const allCards = page.getByTestId(/recipe-card-/);
    const initialCount = await allCards.count();
    expect(initialCount).toBeGreaterThanOrEqual(1);

    await searchInput.fill('Grinch');

    const filteredCards = page.getByTestId(/recipe-card-/);
    const filteredCount = await filteredCards.count();
    expect(filteredCount).toBeGreaterThanOrEqual(1);
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    await expect(
      page.getByText('The Grinch', { exact: true })
    ).toBeVisible();
  });
});
