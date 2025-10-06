import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import { AppProviders } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cryptotrade Experience Console",
  description:
    "Operational console for Cryptotrade frontend teams to manage catalog, orders, and delivery readiness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-transparent antialiased`}
      >
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-10">
              {children}
            </main>
            <footer className="border-t border-white/5 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
              <p>
                Cryptotrade Frontend Suite · Crafted for parity with the Go
                backend · Tailwind-driven design
              </p>
            </footer>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
