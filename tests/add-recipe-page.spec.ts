import { expect } from "@playwright/test";
import { test } from "./auth-utils";
import { PLAYWRIGHT_BASE_URL } from "./test-helpers";

test.describe("Add recipe page", () => {
  test("renders form fields and validations", async ({ getUserPage }) => {
    const page = await getUserPage("john@foo.com", "changeme");

    await page.goto(`${PLAYWRIGHT_BASE_URL}/add-recipe`);
    await page.waitForLoadState("networkidle");

    const form = page.getByTestId("add-recipe-form");

   
  });
});
