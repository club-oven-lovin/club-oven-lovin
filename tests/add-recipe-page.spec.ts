import { expect } from "@playwright/test";
import { test } from "./auth-utils";
import { PLAYWRIGHT_BASE_URL } from "./test-helpers";

test.describe("Add recipe page", () => {
  test("renders form fields and validations", async ({ getUserPage }) => {
    const page = await getUserPage("john@foo.com", "changeme");

    await page.goto(`${PLAYWRIGHT_BASE_URL}/add-recipe`);
    await page.waitForLoadState("networkidle");

    const form = page.getByTestId("add-recipe-form");
    await expect(
      page.getByRole("heading", { name: "Create Your Culinary Masterpiece" }),
    ).toBeVisible();
    await expect(
      form.locator('[data-testid="recipe-name-field"] input'),
    ).toBeVisible();
    await expect(
      form.locator('[data-testid="recipe-image-field"] input'),
    ).toBeVisible();
    await expect(
      form.locator('[data-testid="recipe-ingredients-field"] textarea'),
    ).toBeVisible();
    await expect(
      form.locator('[data-testid="recipe-steps-field"] textarea'),
    ).toBeVisible();
    await expect(
      form.locator('[data-testid="recipe-tags-field"] input'),
    ).toBeVisible();
    await expect(
      form
        .locator('[data-testid="recipe-dietary-field"]')
        .getByRole("checkbox"),
    ).toHaveCount(5);

    await form.getByRole("button", { name: "Submit" }).click();
  });
});
