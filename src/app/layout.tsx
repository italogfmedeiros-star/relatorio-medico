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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "Relatório Médico | Prescrições Manipuladas",
  description: "Dashboard de análise de prescrições de receitas manipuladas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">
        <a href="#main-content" className="skip-link glass-panel px-4 py-2 text-sm font-medium text-slate-800">
          Pular para o conteúdo
        </a>
        <div aria-hidden className="bg-ambient pointer-events-none fixed inset-0 -z-20" />
        <div aria-hidden className="bg-grain pointer-events-none fixed inset-0 -z-10 opacity-[0.035] mix-blend-overlay" />
        {children}
      </body>
    </html>
  );
}
