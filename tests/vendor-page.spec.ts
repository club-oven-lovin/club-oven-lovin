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

    const table = page.getByTestId("ingredients-table");
  });
});
