import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily English Topics",
  description: "Improve your English with daily Reddit discussions. Learn new vocabulary, phrases, and practice with real conversations.",
  keywords: "English learning, vocabulary, Reddit, daily practice, language learning",
  authors: [{ name: "Daily English Topics" }],
  openGraph: {
    title: "Daily English Topics",
    description: "Improve your English with daily Reddit discussions",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily English Topics",
    description: "Improve your English with daily Reddit discussions",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
