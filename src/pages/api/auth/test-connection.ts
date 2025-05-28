import type { APIRoute } from "astro";
import { supabaseClient } from "@/db/supabase.client";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ status: "connected", session: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to connect to Supabase" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
