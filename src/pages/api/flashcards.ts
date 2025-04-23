import type { APIRoute } from "astro";
import { z } from "zod";
import type { CreateFlashcardsDTO } from "@/types";
import { FlashcardService } from "@/lib/services/flashcard.service";
import { DEFAULT_USER_ID } from "@/db/supabase.client";

export const prerender = false;

const FlashcardSchema = z.object({
  front: z.string().max(200, "Front side must not exceed 200 characters"),
  back: z.string().max(500, "Back side must not exceed 500 characters"),
  source: z.enum(["ai-full", "ai-edited", "manual"]),
  generation_id: z.number(),
});

const CreateFlashcardsSchema = z.object({
  flashcards: z.array(FlashcardSchema),
});

export const POST: APIRoute = async ({ request, locals }) => {
  const flashcardService = new FlashcardService(locals.supabase);

  try {
    const body = (await request.json()) as CreateFlashcardsDTO;
    const validatedData = CreateFlashcardsSchema.parse(body);

    const savedFlashcards = await flashcardService.createFlashcards(DEFAULT_USER_ID, validatedData);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully saved ${savedFlashcards.length} flashcards`,
        data: savedFlashcards,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Validation error",
          details: error.errors,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.error("Error saving flashcards:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
