import { expect } from "@playwright/test";
import { test } from "./auth-utils";
import { PLAYWRIGHT_BASE_URL } from "./test-helpers";

test.describe("User home page", () => {
  test("shows hero, quick actions, and recommendations", async ({
    getUserPage,
  }) => {
    const page = await getUserPage("john@foo.com", "changeme");

    await page.goto(`${PLAYWRIGHT_BASE_URL}/user-home-page`);
    await page.waitForLoadState("networkidle");


    const quickActionsHeading = page.getByRole("heading", {
      name: "Stay in flow with one-tap tasks",
    });

  });
});
