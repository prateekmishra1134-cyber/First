import { NextResponse } from "next/server";
/** User-scoped persistence is enabled after verified Supabase Auth session integration. */
export async function PATCH(){return NextResponse.json({error:"Authentication is required to update an application."},{status:401});}
