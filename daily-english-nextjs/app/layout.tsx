import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

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
    <html lang="en" className="antialiased">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} bg-gray-900 text-white`}>
        {/* Background Gradient */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-indigo-600 to-purple-600"></div>

        <Header />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 py-8">
          <div className="container mx-auto px-6 text-gray-400">
            <div className="flex flex-wrap justify-center space-x-6">
              <a href="https://github.com/ttpss930141011/daily-english-topic" className="hover:text-white">
                <i className="fab fa-github mr-1"></i>GitHub
              </a>
              <a href="#" className="hover:text-white">About</a>
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
            </div>
            <p className="mt-4 text-center text-sm">
              Updated on {new Date().toLocaleDateString()} • Powered by Reddit API & Azure OpenAI
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
