import { test, expect } from "@playwright/test";

test.describe("Strona główna", () => {
  test("powinna zawierać tytuł", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Generate Flashcards/i);
  });
});
