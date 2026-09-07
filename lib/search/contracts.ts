import type { Job } from "@/types/domain"; import type { z } from "zod"; import type { searchCriteriaSchema } from "@/lib/validation/schemas";
export type SearchCriteria=z.infer<typeof searchCriteriaSchema>;
export interface ProviderResult { jobs:Job[]; warning?:string; }
export interface JobSearchProvider { id:string; label:string; enabled:boolean; searchJobs(criteria:SearchCriteria):Promise<ProviderResult>; getJobDetails?(url:string):Promise<Job|null>; }
