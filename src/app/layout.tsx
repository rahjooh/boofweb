import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import { AppProviders } from "./providers";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "بوف  | تغذیه تخصصی سگ‌ها",
  description:
    "مکمل‌ها و برنامه‌های تغذیه‌ای علمی برای سگ‌های خانگی با ارسال منظم، پشتیبانی دامپزشکی و محتوای فارسی.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazirmatn.variable} min-h-screen bg-transparent font-sans antialiased`}
      >
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-10">
              {children}
            </main>
            <footer className="border-t border-emerald-100/60 bg-emerald-50/80 py-6 text-center text-xs text-emerald-700">
              <p>
                بوف  · ساخته شده با عشق به حیوانات خانگی · پشتیبانی
                تلفنی ۷ روز هفته
              </p>
            </footer>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
