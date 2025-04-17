// DTO and Command Model definitions for the API

// Import database types from the DB module
import type { Database } from "./db/database.types";

// ========== Flashcards DTOs ===========

// Represents a flashcard record, based on the database definition
export type FlashcardDTO = Database["public"]["Tables"]["flashcards"]["Row"];

// DTO for pagination information
export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
}

// Response DTO for GET /flashcards endpoint
export interface FlashcardsResponseDTO {
  data: FlashcardDTO[];
  pagination: PaginationDTO;
}

// Allowed flashcard sources
export type FlashcardSource = "ai-full" | "ai-edited" | "manual";

// Command Model for creating a flashcard
// Union type to enforce that if the flashcard is created manually, generation_id must be null,
// and if created via AI, generation_id must be provided and be a number.
export type CreateFlashcardCommand = {
  front: string; // maximum length 200
  back: string; // maximum length 500
  source: FlashcardSource;
  generation_id: number | null;
};

// Request DTO for POST /flashcards endpoint
export interface CreateFlashcardsDTO {
  flashcards: CreateFlashcardCommand[];
}

// Command Model for updating a flashcard (fields are optional)
export type UpdateFlashcardCommand = Partial<
  Pick<Database["public"]["Tables"]["flashcards"]["Update"], "front" | "back" | "source" | "generation_id">
>;

// ========== Generations DTOs ===========

// Command Model for initiating a generation request
export interface CreateGenerationCommand {
  source_text: string; // Must be between 1000 and 10000 characters
}

// DTO for a generated flashcard proposal (as returned in the generation response)
export interface FlashcardProposalDTO {
  front: string;
  back: string;
  source: "ai-full"; // As per API plan, proposals are generated with source 'ai-full'
}

// Response DTO for POST /generations endpoint
export interface GenerationResponseDTO {
  generation_id: number;
  flashcards_proposals: FlashcardProposalDTO[];
  generated_count: number;
}

// DTO for a generation record based on the database model
export type GenerationDTO = Database["public"]["Tables"]["generations"]["Row"];
