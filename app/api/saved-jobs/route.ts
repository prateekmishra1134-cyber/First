import { NextResponse } from "next/server";
/** User-scoped persistence is enabled after verified Supabase Auth session integration. */
export async function POST(){return NextResponse.json({error:"Authentication is required to save a job."},{status:401});}
