import { expect } from "@playwright/test";
import { test } from "./auth-utils";
import { PLAYWRIGHT_BASE_URL } from "./test-helpers";

test.describe("Vendor page", () => {
  test("shows vendor summary, ingredients, and add form", async ({
    getUserPage,
  }) => {
    const page = await getUserPage("john@foo.com", "changeme");

    await page.goto(`${PLAYWRIGHT_BASE_URL}/vendors`);
    await page.waitForLoadState("networkidle");

    const welcomeCard = page.getByTestId("vendor-greeting-card");
    await expect(welcomeCard.getByText("Welcome,")).toBeVisible();
    await expect(welcomeCard.getByText("John’s Fresh Market")).toBeVisible();
    await expect(welcomeCard.getByText("123 College Ave")).toBeVisible();

    const table = page.getByTestId("ingredients-table");
    await expect(table.getByRole("row", { name: /Milk/ })).toContainText(
      "$4.99",
    );
    await expect(table.getByRole("row", { name: /Eggs/ })).toContainText(
      "$3.49",
    );

    await expect(page.getByPlaceholder("Name")).toBeVisible();
    await expect(page.getByPlaceholder("Price")).toBeVisible();
    await expect(page.getByPlaceholder("Size")).toBeVisible();
    await expect(page.getByRole("button", { name: /Add/i })).toBeVisible();
  });
});
