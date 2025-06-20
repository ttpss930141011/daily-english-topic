import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { AppHeader } from "@/components/AppHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Daily English Topics",
  description: "Learn English through interactive slide presentations from Reddit discussions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="antialiased">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} text-white`}>
        <I18nProvider initialLanguage="zh-TW">
          <AppHeader />
          <main>
            {children}
          </main>
        </I18nProvider>
      </body>
    </html>
  );
}
