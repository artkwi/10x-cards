import type { APIRoute } from "astro";
import { supabaseClient } from "@/db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Wyloguj z Supabase
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return new Response(
        JSON.stringify({
          error: "Wystąpił błąd podczas wylogowywania",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Wyczyść cookie sesji
    cookies.delete("session", {
      path: "/",
    });

    // Wyczyść cookie sb-token
    cookies.delete("sb-token", {
      path: "/",
    });

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Logout error:", err);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas wylogowywania",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
