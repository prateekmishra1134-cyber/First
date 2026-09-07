import OpenAI from "openai";
import { candidateProfileSchema } from "@/lib/validation/schemas";
import { CV_EXTRACTION_SYSTEM } from "@/lib/ai/prompts";
import type { CandidateProfile } from "@/types/domain";
export async function extractCandidateProfile(cvText:string): Promise<CandidateProfile> {
 if (!process.env.OPENAI_API_KEY) throw new Error("AI analysis is not configured. Add OPENAI_API_KEY on the server.");
 const client = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
 const completion = await client.chat.completions.create({model:"gpt-4o-mini", response_format:{type:"json_object"}, messages:[{role:"system",content:CV_EXTRACTION_SYSTEM},{role:"user",content:cvText.slice(0,50000)}]});
 return candidateProfileSchema.parse(JSON.parse(completion.choices[0].message.content ?? "{}"));
}
