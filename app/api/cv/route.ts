import { NextResponse } from "next/server";
import { uploadSchema } from "@/lib/validation/schemas";
import { extractCvText } from "@/lib/utils/cv";
import { extractCandidateProfile } from "@/lib/ai/openai";

export async function POST(request: Request) {
  const form = await request.formData(); const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "CV file is required" }, { status: 400 });
  try {
    uploadSchema.parse({ filename: file.name, size: file.size, mimeType: file.type });
    const text = await extractCvText(file);
    if (!text.trim()) return NextResponse.json({ error: "No readable text was found in this CV." }, { status: 422 });
    const profile = await extractCandidateProfile(text);
    // Persist encrypted/private file and profile only after verified Supabase user session is wired.
    return NextResponse.json({ profile });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to process CV" }, { status: 400 }); }
}
