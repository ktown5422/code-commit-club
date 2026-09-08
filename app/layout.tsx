import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://codestreakapp.vercel.app";
const description =
  "Turn daily GitHub commits into visible streaks, habit insights, and shared momentum with your Discord community.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CodeStreak — build the habit one commit at a time",
    template: "%s · CodeStreak",
  },
  description,
  keywords: ["GitHub", "commit streak", "developer habits", "Discord", "Next.js"],
  authors: [{ name: "Kevin Townson" }],
  creator: "Kevin Townson",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "CodeStreak",
    title: "CodeStreak — build the habit one commit at a time",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeStreak — build the habit one commit at a time",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
