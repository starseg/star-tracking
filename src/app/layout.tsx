import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Star Tracking",
    default: "Star Tracking",
  },
  description: "Plataforma de controle de rastreamento de veículos da Starseg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={cn(nunito.className, "dark")}>{children}</body>
    </html>
  );
}
