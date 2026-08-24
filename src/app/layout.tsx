import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Summarize any document within minutes | SummifierAI",
  description: "Upload any PDF or image document and get AI-powered smart summaries with key points and improvement suggestions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen app-background text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
