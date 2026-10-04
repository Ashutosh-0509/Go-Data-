import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smart Data Analyst — Automated Data Profiling, Cleaning, EDA & AutoML",
  description:
    "Upload a CSV or Excel dataset and turn raw data into analysis-ready insights with automated profiling, cleaning, exploration and model benchmarking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${manrope.variable} h-full antialiased font-sans`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#0F172A]">
        {children}
      </body>
    </html>
  );
}
