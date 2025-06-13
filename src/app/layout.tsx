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
        <aside className="w-64 bg-gray-800 text-white flex flex-col py-8 px-4 min-h-screen">
          <div className="text-2xl font-bold mb-8 text-center">Menu</div>
          <nav className="flex flex-col gap-4">
            <a href="/" className="hover:bg-gray-700 rounded px-3 py-2 transition">Início</a>
            <a href="/solicitacoes" className="hover:bg-gray-700 rounded px-3 py-2 transition">Solicitações</a>
            <a href="/criar-solicitacao" className="hover:bg-gray-700 rounded px-3 py-2 transition">Criar Solicitação</a>
            <a href="/usuarios" className="hover:bg-gray-700 rounded px-3 py-2 transition">Usuários</a>
          </nav>
        </aside>
        <main className="flex-1 bg-gray-50 p-8">{children}</main>
      </body>
    </html>
  );
}
