import type { Metadata } from "next";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";

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
    <html lang="en">
      <body>
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
