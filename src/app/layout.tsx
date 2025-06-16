import type { Metadata } from "next";
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
      <body className="flex h-screen min-h-screen">
        <Sidebar />
        <main className="flex-1 h-screen min-h-0 flex items-center justify-center bg-gray-900">
          {children}
        </main>
      </body>
    </html>
  );
}
