import { defineMiddleware } from "astro:middleware";
import { supabaseClient } from "../db/supabase.client";

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = supabaseClient;

  // Get session from cookie
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  // Add user to locals if session exists
  if (session?.user) {
    context.locals.user = session.user;
  }

  // Allow access to API endpoints and login page without authentication
  const isApiRoute = context.url.pathname.startsWith("/api");
  const isLoginPage = context.url.pathname === "/";

  // If user is not authenticated and trying to access protected route
  if (!session?.user && !isApiRoute && !isLoginPage) {
    return context.redirect("/");
  }

  return next();
});
