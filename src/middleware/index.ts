import { defineMiddleware } from "astro:middleware";
import { supabaseClient } from "../db/supabase.client";

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = supabaseClient;

  // Get session from cookie
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  // Add user ID to locals if session exists
  if (session?.user) {
    context.locals.userId = session.user.id;
  }

  return next();
});
