import type { APIRoute } from "astro";
import { z } from "zod";
import { GenerationService } from "../../../lib/generation.service";
import type { Locals } from "../../../types";

/**
 * GET /generations/{id}
 *
 * Retrieves details of a specific flashcard generation by its ID.
 *
 * Path Parameters:
 * - id: Generation ID (positive integer)
 *
 * Response:
 * {
 *   id: number;
 *   user_id: string;
 *   source_text_hash: string;
 *   source_text_length: number;
 *   generated_count: number;
 *   generation_duration: number;
 *   model: string;
 *   created_at: string;
 *   updated_at: string;
 *   flashcards?: Array<{
 *     id: number;
 *     front: string;
 *     back: string;
 *     source: string;
 *     generation_id: number;
 *     created_at: string;
 *     updated_at: string;
 *   }>;
 * }
 *
 * Error Responses:
 * - 400 Bad Request: Invalid generation ID
 * - 404 Not Found: Generation not found
 * - 500 Internal Server Error: Server error
 */

// Input validation schema
const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const GET: APIRoute = async ({
  params,
  locals,
}: {
  params: Record<string, string | undefined>;
  locals: Locals;
}) => {
  try {
    // Validate path parameters
    const { id } = paramsSchema.parse(params);

    // Initialize service
    const generationService = new GenerationService(locals.supabase, locals.user.id, {
      apiKey: import.meta.env.OPENROUTER_API_KEY,
    });

    // Get generation
    const generation = await generationService.getGenerationById(id);

    return new Response(JSON.stringify(generation), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(`Error in GET /generations/${params.id}:`, error);

    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: "Invalid generation ID" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (error instanceof Error && error.message === "Generation not found") {
      return new Response(JSON.stringify({ error: "Generation not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
