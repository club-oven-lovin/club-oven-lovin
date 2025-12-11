import { expect } from "@playwright/test";
import { test } from "./auth-utils";
import { PLAYWRIGHT_BASE_URL } from "./test-helpers";

test.describe("User profile page", () => {
  test("shows profile summary and recipe sections", async ({ getUserPage }) => {
    const page = await getUserPage("john@foo.com", "changeme");

    await page.goto(`${PLAYWRIGHT_BASE_URL}/userprofile`);
    await page.waitForLoadState("networkidle");

    const profileCard = page.getByTestId("profile-card");
  });
});
