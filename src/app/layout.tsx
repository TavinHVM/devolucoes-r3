import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="pt-br" className="h-full w-full">
      <body className="flex flex-col h-full w-full min-h-screen min-w-0">
        {/* <Header /> */}
        <main className="flex-1 h-full w-full min-h-0 min-w-0 overflow-auto bg-gray-900">
          {children}
        </main>
      </body>
    </html>
  );
}
