import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type SupabaseClient = typeof supabaseClient;
// local
// export const DEFAULT_USER_ID = "664f25b7-a243-4e43-b437-800a7bd8a818";
// dev
export const DEFAULT_USER_ID = "d193d009-5e66-4d7a-b9ac-ab46c69f4d2c";
