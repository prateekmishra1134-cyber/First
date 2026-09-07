import { createClient } from "@supabase/supabase-js";
export function getServerSupabase(){ const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY; if(!url||!key) throw new Error("Supabase server credentials are not configured."); return createClient(url,key,{auth:{persistSession:false}}); }
/** Auth must be resolved from a verified Supabase session in each route before user data access. */
