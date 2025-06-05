import type { APIRoute } from "astro";
import { z } from "zod";
import { GenerationService } from "../../../lib/generation.service";
import type { Locals } from "../../../types";

/**
 * GET /generations
 *
 * Retrieves a paginated list of flashcard generations for the authenticated user.
 *
 * Query Parameters:
 * - page (optional): Page number, defaults to 1
 * - limit (optional): Number of items per page, defaults to 10, max 100
 *
 * Response:
 * {
 *   data: Array<{
 *     id: number;
 *     user_id: string;
 *     source_text_hash: string;
 *     source_text_length: number;
 *     generated_count: number;
 *     generation_duration: number;
 *     model: string;
 *     created_at: string;
 *     updated_at: string;
 *     flashcards?: Array<{
 *       id: number;
 *       front: string;
 *       back: string;
 *       source: string;
 *       generation_id: number;
 *       created_at: string;
 *       updated_at: string;
 *     }>;
 *   }>;
 *   pagination: {
 *     page: number;
 *     limit: number;
 *     total: number;
 *   };
 * }
 *
 * Error Responses:
 * - 400 Bad Request: Invalid query parameters
 * - 500 Internal Server Error: Server error
 */

// Input validation schema
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const GET: APIRoute = async ({ request, locals }: { request: Request; locals: Locals }) => {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    // Validate query parameters
    const { page, limit } = querySchema.parse(queryParams);

    // Initialize service
    const generationService = new GenerationService(locals.supabase, locals.user.id, {
      apiKey: import.meta.env.OPENROUTER_API_KEY,
    });

    // Get generations
    const result = await generationService.getGenerations(page, limit);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in GET /generations:", error);

    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: "Invalid query parameters" }), {
        status: 400,
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
