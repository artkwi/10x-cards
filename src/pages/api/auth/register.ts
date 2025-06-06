import type { APIRoute } from "astro";
import { supabaseClient } from "@/db/supabase.client";
import { registerSchema } from "@/lib/schemas/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Walidacja danych wejściowych
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowe dane wejściowe",
          details: result.error.flatten(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { email, password } = result.data;

    // Próba rejestracji
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${new URL(request.url).origin}/`,
      },
    });

    if (error) {
      // Obsługa specyficznych błędów
      if (error.message.includes("already registered")) {
        return new Response(
          JSON.stringify({
            error: "Ten adres email jest już zarejestrowany",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          error: "Wystąpił błąd podczas rejestracji",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Jeśli rejestracja się powiodła
    return new Response(
      JSON.stringify({
        success: true,
        session: data.session,
        user: data.user,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas rejestracji",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
