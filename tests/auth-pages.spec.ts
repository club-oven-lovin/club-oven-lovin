import { test, expect } from "@playwright/test";
import { PLAYWRIGHT_BASE_URL } from "./test-helpers";

test.describe("Authentication pages", () => {
  test("renders sign in form with navigation link", async ({ page }) => {
    await page.goto(`${PLAYWRIGHT_BASE_URL}/auth/signin`);
    await page.waitForLoadState("networkidle");

    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { name: "Sign In" })).toBeVisible();

    const emailInput = main.locator('input[name="email"]');
    const passwordInput = main.locator('input[name="password"]');

    await expect(emailInput).toHaveAttribute("placeholder", "example@foo.com");
    await expect(passwordInput).toHaveAttribute("type", "password");

    await expect(
      main.getByRole("button", { name: /sign in/i, exact: false }),
    ).toBeVisible();
    await expect(main.getByRole("link", { name: /sign up/i })).toBeVisible();
  });

  test("validates sign up form fields", async ({ page }) => {
    await page.goto(`${PLAYWRIGHT_BASE_URL}/auth/signup`);
    await page.waitForLoadState("networkidle");

    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { name: "Sign Up" })).toBeVisible();

    const registerButton = main.getByRole("button", { name: "Register" });
    const resetButton = main.getByRole("button", { name: "Reset" });

    await expect(registerButton).toBeVisible();
    await expect(resetButton).toBeVisible();

    await registerButton.click();

    await expect(main.getByText("Email is required")).toBeVisible();
    await expect(main.getByText("Confirm Password is required")).toBeVisible();
    await expect(main.getByRole("link", { name: /sign in/i })).toBeVisible();
  });
});
