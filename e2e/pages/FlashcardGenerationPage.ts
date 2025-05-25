import type { Page } from "@playwright/test";

export class FlashcardGenerationPage {
  private readonly textInput;
  private readonly characterCount;
  private readonly validationMessage;
  private readonly generateButton;
  private readonly saveButton;

  constructor(private readonly page: Page) {
    this.textInput = this.page.getByTestId("flashcard-text-input");
    this.characterCount = this.page.getByTestId("character-count");
    this.validationMessage = this.page.getByTestId("length-validation-message");
    this.generateButton = this.page.getByTestId("generate-flashcards-button");
    this.saveButton = this.page.getByTestId("save-flashcards-button");
  }

  // Methods
  async fillTextInput(text: string) {
    await this.textInput.fill(text);
  }

  async getCharacterCount(): Promise<string> {
    return (await this.characterCount.textContent()) || "";
  }

  async getValidationMessage(): Promise<string | null> {
    const isVisible = await this.validationMessage.isVisible();
    return isVisible ? await this.validationMessage.textContent() : null;
  }

  async clickGenerateButton() {
    await this.generateButton.click();
  }

  async getFlashcardItem(id: string) {
    return this.page.getByTestId(`flashcard-item-${id}`);
  }

  async acceptFlashcard(id: string) {
    await this.page.getByTestId(`accept-flashcard-${id}`).click();
  }

  async rejectFlashcard(id: string) {
    await this.page.getByTestId(`reject-flashcard-${id}`).click();
  }

  async editFlashcard(id: string) {
    await this.page.getByTestId(`edit-flashcard-${id}`).click();
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async waitForGeneration() {
    await this.page.waitForSelector('[data-test-id="flashcard-item-0"]');
  }

  async getAcceptedFlashcardsCount(): Promise<number> {
    const acceptedCards = await this.page.$$('[data-test-id^="flashcard-item-"]');
    return acceptedCards.length;
  }
}
