import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
//@ts-ignore
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Better Vindico Calendar",
  description: "A better calendar for Vindico Arena Ice Skating sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased tracking-wide`}
      >
        <Header />
        <hr className="mx-auto max-xl:w-4/5 max-w-[var(--breakpoint-xl)] px-4 border-4 border-[#6C9A8B] shadow-[4px_4px_0px_#111] my-6" />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
