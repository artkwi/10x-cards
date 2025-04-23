import type { SupabaseClient } from "../../db/supabase.client";
import type { CreateFlashcardsDTO, FlashcardDTO } from "../../types";

export class FlashcardService {
  constructor(private readonly supabase: SupabaseClient) {}

  async createFlashcards(userId: string, command: CreateFlashcardsDTO): Promise<FlashcardDTO[]> {
    const flashcardsToInsert = command.flashcards.map((flashcard) => ({
      user_id: userId,
      front: flashcard.front,
      back: flashcard.back,
      source: flashcard.source,
      generation_id: flashcard.generation_id,
    }));

    const { data, error } = await this.supabase.from("flashcards").insert(flashcardsToInsert).select();

    if (error) {
      throw new Error(`Failed to create flashcards: ${error.message}`);
    }

    return data;
  }
}
