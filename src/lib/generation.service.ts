import crypto from "crypto";
import type { FlashcardProposalDto, GenerationCreateResponseDto, GenerationDetailDto, PaginationDto } from "../types";
import type { SupabaseClient } from "../db/supabase.client";
import { OpenRouterService } from "./openrouter.service";
import { OpenRouterError } from "./openrouter.types";

export class GenerationService {
  private readonly openRouter: OpenRouterService;
  private readonly model = "openai/gpt-4o-mini";

  constructor(
    private readonly supabase: SupabaseClient,
    private readonly userId: string,
    openRouterConfig?: { apiKey: string }
  ) {
    if (!openRouterConfig?.apiKey) {
      throw new Error("OpenRouter API key is required");
    }
    if (!userId) {
      throw new Error("User ID is required");
    }
    this.openRouter = new OpenRouterService({
      apiKey: openRouterConfig.apiKey,
      timeout: 60000, // 60 seconds timeout for longer generations
    });

    // Configure OpenRouter
    this.openRouter.setModel(this.model, {
      temperature: 0.7,
      top_p: 1,
    });

    this.openRouter
      .setSystemMessage(`You are an AI assistant specialized in creating high-quality flashcards from provided text.
Generate concise, clear, and effective flashcards that capture key concepts and knowledge.
Each flashcard should have a front (question/prompt) and back (answer/explanation).
Focus on important facts, definitions, concepts, and relationships.`);

    this.openRouter.setResponseFormat({
      name: "flashcards",
      schema: {
        type: "object",
        properties: {
          flashcards: {
            type: "array",
            items: {
              type: "object",
              properties: {
                front: { type: "string" },
                back: { type: "string" },
              },
              required: ["front", "back"],
            },
          },
        },
        required: ["flashcards"],
      },
    });
  }

  async generateFlashcards(sourceText: string): Promise<GenerationCreateResponseDto> {
    try {
      // 1. Calculate metadata
      const startTime = Date.now();
      const sourceTextHash = await this.calculateHash(sourceText);

      // 2. Call AI service through OpenRouter
      const proposals = await this.callAIService(sourceText);

      // 3. Save generation metadata
      const generationId = await this.saveGenerationMetadata({
        sourceText,
        sourceTextHash,
        generatedCount: proposals.length,
        durationMs: Date.now() - startTime,
      });

      return {
        generation_id: generationId,
        flashcards_proposals: proposals,
        generated_count: proposals.length,
      };
    } catch (error) {
      // Log error and save to generation_error_logs
      await this.logGenerationError(error, {
        sourceTextHash: await this.calculateHash(sourceText),
        sourceTextLength: sourceText.length,
      });
      throw error;
    }
  }

  private async calculateHash(text: string): Promise<string> {
    return crypto.createHash("md5").update(text).digest("hex");
  }

  private async callAIService(text: string): Promise<FlashcardProposalDto[]> {
    try {
      // Set the user message with the source text
      this.openRouter.setUserMessage(`Generate flashcards from the following text:\n\n${text}`);

      // Get response from OpenRouter
      const response = await this.openRouter.sendChatMessage();

      // Parse the JSON response
      const data = JSON.parse(response);

      // Validate response structure
      if (!data.flashcards || !Array.isArray(data.flashcards)) {
        throw new Error("Invalid response format: missing flashcards array");
      }

      // Convert to FlashcardProposalDto format
      return data.flashcards.map((card: { front: string; back: string }) => ({
        front: card.front,
        back: card.back,
        source: "ai-full" as const,
      }));
    } catch (error) {
      if (error instanceof OpenRouterError) {
        throw new Error(`AI Service error: ${error.message} (${error.code})`);
      }
      throw error;
    }
  }

  private async saveGenerationMetadata(data: {
    sourceText: string;
    sourceTextHash: string;
    generatedCount: number;
    durationMs: number;
  }): Promise<number> {
    const { data: generation, error } = await this.supabase
      .from("generations")
      .insert({
        user_id: this.userId,
        source_text_hash: data.sourceTextHash,
        source_text_length: data.sourceText.length,
        generated_count: data.generatedCount,
        generation_duration: data.durationMs,
        model: this.model,
      })
      .select("id")
      .single();

    if (error) throw error;
    return generation.id;
  }

  private async logGenerationError(
    error: unknown,
    data: {
      sourceTextHash: string;
      sourceTextLength: number;
    }
  ): Promise<void> {
    await this.supabase.from("generation_error_logs").insert({
      user_id: this.userId,
      error_code: error instanceof Error ? error.name : "UNKNOWN",
      error_message: error instanceof Error ? error.message : String(error),
      model: this.model,
      source_text_hash: data.sourceTextHash,
      source_text_length: data.sourceTextLength,
    });
  }

  // New methods for fetching generations
  async getGenerations(
    page = 1,
    limit = 10
  ): Promise<{
    data: GenerationDetailDto[];
    pagination: PaginationDto;
  }> {
    // Calculate offset
    const offset = (page - 1) * limit;

    // Get total count
    const { count, error: countError } = await this.supabase
      .from("generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", this.userId);

    if (countError) throw countError;

    // Get generations with pagination
    const { data: generations, error } = await this.supabase
      .from("generations")
      .select("*")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Get flashcards for each generation
    const generationsWithFlashcards = await Promise.all(
      generations.map(async (generation) => {
        const { data: flashcards } = await this.supabase
          .from("flashcards")
          .select("*")
          .eq("generation_id", generation.id);

        return {
          ...generation,
          flashcards: flashcards || [],
        };
      })
    );

    return {
      data: generationsWithFlashcards,
      pagination: {
        page,
        limit,
        total: count || 0,
      },
    };
  }

  async getGenerationById(id: number): Promise<GenerationDetailDto> {
    // Get generation
    const { data: generation, error } = await this.supabase
      .from("generations")
      .select("*")
      .eq("id", id)
      .eq("user_id", this.userId)
      .single();

    if (error) throw error;
    if (!generation) throw new Error("Generation not found");

    // Get flashcards
    const { data: flashcards } = await this.supabase.from("flashcards").select("*").eq("generation_id", id);

    return {
      ...generation,
      flashcards: flashcards || [],
    };
  }
}
