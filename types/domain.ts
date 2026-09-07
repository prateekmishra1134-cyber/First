export type RemoteType = "remote" | "hybrid" | "on_site" | "unknown";
export type ApplicationStatus = "saved" | "applying" | "applied" | "interview" | "offer" | "rejected" | "archived";

export interface CandidateProfile {
  fullName: string | null; education: string[]; experience: Experience[]; skills: string[];
  technicalSkills: string[]; softSkills: string[]; certifications: string[]; projects: string[];
  industries: string[]; languages: string[]; locations: string[]; likelyRoles: string[];
  seniority: string | null; yearsExperience: number | null; keywords: string[]; atsKeywords: string[];
  strengths: string[]; potentialWeaknesses: string[];
}
export interface Experience { title: string; employer: string | null; dates: string | null; summary: string | null; }
export interface Job { id?: string; externalId?: string | null; title: string; company: string; location: string | null; country: string | null; remoteType: RemoteType; employmentType: string | null; salary: string | null; description: string | null; requirements: string[]; skills: string[]; source: string; sourceUrl: string; applicationUrl: string; postedDate: string | null; discoveredDate: string; companyWebsite: string | null; isFortune500: boolean; fortune500Rank: number | null; sourceUrls?: string[]; }
export interface MatchAnalysis { score: number; confidence: "high" | "medium" | "low"; matchingSkills: string[]; missingSkills: string[]; matchingExperience: string[]; missingExperience: string[]; educationMatch: "met" | "partial" | "unknown" | "not_met"; locationMatch: "met" | "partial" | "unknown" | "not_met"; concerns: string[]; explanation: string; }
