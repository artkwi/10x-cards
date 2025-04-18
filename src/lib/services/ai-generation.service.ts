import type { FlashcardProposalDTO } from "../../types";

export class AIGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIGenerationError";
  }
}

export interface GenerationResult {
  flashcards: FlashcardProposalDTO[];
  count: number;
  duration: number;
}

export class AIGenerationService {
  private readonly TIMEOUT_MS = 60000; // 60 seconds timeout as per implementation plan

  async generateFlashcards(sourceText: string): Promise<GenerationResult> {
    try {
      const startTime = Date.now();

      // Mock AI generation with a small delay to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // This is a placeholder implementation
      const mockFlashcards: FlashcardProposalDTO[] = [
        {
          front: "What is the capital of France?",
          back: "Paris",
          source: "ai-full",
        },
        {
          front: "What is the largest planet in our solar system?",
          back: "Jupiter",
          source: "ai-full",
        },
      ];

      const duration = Date.now() - startTime;

      return {
        flashcards: mockFlashcards,
        count: mockFlashcards.length,
        duration,
      };
    } catch (error) {
      throw new AIGenerationError(error instanceof Error ? error.message : "Unknown error during AI generation");
    }
  }
}
