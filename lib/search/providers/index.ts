import { ManualIntegrationProvider } from "./disabled"; import { CompanyCareersProvider } from "./company-careers";
export const providers=[new CompanyCareersProvider(),new ManualIntegrationProvider("linkedin","LinkedIn"),new ManualIntegrationProvider("indeed","Indeed"),new ManualIntegrationProvider("naukri","Naukri"),new ManualIntegrationProvider("wellfound","Wellfound")];
