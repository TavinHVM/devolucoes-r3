import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col py-8 px-4 min-h-screen">
      <div className="text-2xl font-bold mb-8 text-center">Menu</div>
      <nav className="flex flex-col gap-4">
        <a href="/" className="hover:bg-gray-700 rounded px-3 py-2 transition">Início</a>
        <a href="/solicitacoes" className="hover:bg-gray-700 rounded px-3 py-2 transition">Solicitações</a>
        <a href="/criar-solicitacao" className="hover:bg-gray-700 rounded px-3 py-2 transition">Criar Solicitação</a>
        <a href="/usuarios" className="hover:bg-gray-700 rounded px-3 py-2 transition">Usuários</a>
      </nav>
    </aside>
  );
} 