import type { APIRoute } from "astro";
import { supabaseClient } from "@/db/supabase.client";
import { loginSchema } from "@/lib/schemas/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Walidacja danych wejściowych
    const result = loginSchema.safeParse(body);
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

    // Próba logowania
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowy email lub hasło",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        session: data.session,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Login error:", err);
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas logowania" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
