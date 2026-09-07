import "./globals.css"; import type { Metadata } from "next";
export const metadata:Metadata={title:"AI Job Finder",description:"A private, evidence-based AI job-search assistant."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
