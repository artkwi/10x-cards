# Test info

- Name: Flashcard Generation >> should show validation message for short text
- Location: /Users/arturkwiatkowski/Documents/Projects/10xdev/10x-cards/e2e/flashcard-generation.spec.ts:38:3

# Error details

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('flashcard-text-input')

    at FlashcardGenerationPage.fillTextInput (/Users/arturkwiatkowski/Documents/Projects/10xdev/10x-cards/e2e/pages/FlashcardGenerationPage.ts:20:26)
    at /Users/arturkwiatkowski/Documents/Projects/10xdev/10x-cards/e2e/flashcard-generation.spec.ts:41:25
```

# Page snapshot

```yaml
- navigation:
  - button "Wyloguj się"
- main:
  - heading "Generate Flashcards" [level=1]
  - textbox "Enter your text here (minimum 1000 characters, maximum 10000 characters)"
  - text: "Characters: 0 1000 more characters needed"
  - button "Generate Flashcards" [disabled]
```

# Test source

```ts
   1 | import type { Page } from "@playwright/test";
   2 |
   3 | export class FlashcardGenerationPage {
   4 |   private readonly textInput;
   5 |   private readonly characterCount;
   6 |   private readonly validationMessage;
   7 |   private readonly generateButton;
   8 |   private readonly saveButton;
   9 |
  10 |   constructor(private readonly page: Page) {
  11 |     this.textInput = this.page.getByTestId("flashcard-text-input");
  12 |     this.characterCount = this.page.getByTestId("character-count");
  13 |     this.validationMessage = this.page.getByTestId("length-validation-message");
  14 |     this.generateButton = this.page.getByTestId("generate-flashcards-button");
  15 |     this.saveButton = this.page.getByTestId("save-flashcards-button");
  16 |   }
  17 |
  18 |   // Methods
  19 |   async fillTextInput(text: string) {
> 20 |     await this.textInput.fill(text);
     |                          ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  21 |   }
  22 |
  23 |   async getCharacterCount(): Promise<string> {
  24 |     return (await this.characterCount.textContent()) || "";
  25 |   }
  26 |
  27 |   async getValidationMessage(): Promise<string | null> {
  28 |     const isVisible = await this.validationMessage.isVisible();
  29 |     return isVisible ? await this.validationMessage.textContent() : null;
  30 |   }
  31 |
  32 |   async clickGenerateButton() {
  33 |     await this.generateButton.click();
  34 |   }
  35 |
  36 |   async getFlashcardItem(id: string) {
  37 |     return this.page.getByTestId(`flashcard-item-${id}`);
  38 |   }
  39 |
  40 |   async acceptFlashcard(id: string) {
  41 |     await this.page.getByTestId(`accept-flashcard-${id}`).click();
  42 |   }
  43 |
  44 |   async rejectFlashcard(id: string) {
  45 |     await this.page.getByTestId(`reject-flashcard-${id}`).click();
  46 |   }
  47 |
  48 |   async editFlashcard(id: string) {
  49 |     await this.page.getByTestId(`edit-flashcard-${id}`).click();
  50 |   }
  51 |
  52 |   async clickSaveButton() {
  53 |     await this.saveButton.click();
  54 |   }
  55 |
  56 |   async waitForGeneration() {
  57 |     await this.page.waitForSelector('[data-test-id="flashcard-item-0"]');
  58 |   }
  59 |
  60 |   async getAcceptedFlashcardsCount(): Promise<number> {
  61 |     const acceptedCards = await this.page.$$('[data-test-id^="flashcard-item-"]');
  62 |     return acceptedCards.length;
  63 |   }
  64 | }
  65 |
```