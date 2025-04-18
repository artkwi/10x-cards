import { z } from "zod";
import type { APIRoute } from "astro";
import type { GenerationResponseDTO } from "../../types";
import { DEFAULT_USER_ID } from "../../db/supabase.client";
import { AIGenerationService } from "../../lib/services/ai-generation.service";
import { GenerationService } from "../../lib/services/generation.service";

// Validation schema for the request body
const generationSchema = z.object({
  source_text: z
    .string()
    .min(1000, "Text must be at least 1000 characters long")
    .max(10000, "Text must not exceed 10000 characters"),
});

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const aiService = new AIGenerationService();
  const generationService = new GenerationService(locals.supabase);
  let source_text = "";

  try {
    // Validate request body
    const body = await request.json();
    const validationResult = generationSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    source_text = validationResult.data.source_text;

    // Generate flashcards using AI service
    const { flashcards, count, duration } = await aiService.generateFlashcards(source_text);

    // Create generation record in database
    const generation = await generationService.createGeneration(DEFAULT_USER_ID, count, source_text, duration);

    const response: GenerationResponseDTO = {
      generation_id: generation.id,
      flashcards_proposals: flashcards,
      generated_count: count,
    };

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing generation request:", error);

    if (error instanceof Error && source_text) {
      await generationService.logGenerationError(DEFAULT_USER_ID, error, source_text);
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
