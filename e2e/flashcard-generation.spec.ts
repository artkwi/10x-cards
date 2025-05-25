import { test, expect } from "@playwright/test";
import { FlashcardGenerationPage } from "./pages/FlashcardGenerationPage";

test.describe("Flashcard Generation", () => {
  let flashcardPage: FlashcardGenerationPage;

  test.beforeEach(async ({ page }) => {
    flashcardPage = new FlashcardGenerationPage(page);
    await page.goto("/");
  });

  test("should generate and save flashcards", async () => {
    // 1. Fill the text input with valid content
    const validText = "Lorem ipsum ".repeat(100); // ~1200 characters
    await flashcardPage.fillTextInput(validText);

    // 2. Verify character count
    const characterCount = await flashcardPage.getCharacterCount();
    expect(characterCount).toContain("1200");

    // 3. Click generate button
    await flashcardPage.clickGenerateButton();

    // 4. Wait for generation to complete
    await flashcardPage.waitForGeneration();

    // 5. Accept the first flashcard
    await flashcardPage.acceptFlashcard("0");

    // 6. Save the flashcards
    await flashcardPage.clickSaveButton();

    // 7. Verify the save was successful
    const acceptedCount = await flashcardPage.getAcceptedFlashcardsCount();
    expect(acceptedCount).toBe(1);
  });

  test("should show validation message for short text", async () => {
    // 1. Fill the text input with invalid content
    const shortText = "Short text";
    await flashcardPage.fillTextInput(shortText);

    // 2. Verify validation message
    const validationMessage = await flashcardPage.getValidationMessage();
    expect(validationMessage).toContain("more characters needed");
  });
});
