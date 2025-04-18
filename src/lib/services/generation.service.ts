import type { SupabaseClient } from "../../db/supabase.client";
import type { GenerationDTO } from "../../types";
import { createHash } from "crypto";

export class GenerationService {
  constructor(private readonly supabase: SupabaseClient) {}

  private generateTextHash(text: string): string {
    return createHash("sha256").update(text).digest("hex");
  }

  async createGeneration(
    userId: string,
    generatedCount: number,
    sourceText: string,
    generationDuration: number
  ): Promise<GenerationDTO> {
    const { data, error } = await this.supabase
      .from("generations")
      .insert([
        {
          user_id: userId,
          model: "gpt-4",
          generated_count: generatedCount,
          generation_duration: generationDuration,
          source_text_hash: this.generateTextHash(sourceText),
          source_text_length: sourceText.length,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create generation record: ${error.message}`);
    }

    return data;
  }

  async logGenerationError(userId: string, error: Error, sourceText: string): Promise<void> {
    const { error: dbError } = await this.supabase.from("generation_error_logs").insert([
      {
        user_id: userId,
        error_code: "GENERATION_ERROR",
        error_message: error.message,
        model: "gpt-4",
        source_text_hash: this.generateTextHash(sourceText),
        source_text_length: sourceText.length,
      },
    ]);

    if (dbError) {
      console.error("Failed to log generation error:", dbError);
    }
  }
}
