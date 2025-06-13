import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "Devoluções R3",
  description: "Sistema de Devoluções R3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 p-8">{children}</main>
      </body>
    </html>
  );
}
