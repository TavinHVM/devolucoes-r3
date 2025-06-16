'use client';
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/solicitacoes", label: "Solicitações" },
  { href: "/criar-solicitacao", label: "Criar Solicitação" },
  { href: "/usuarios", label: "Usuários" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  return (
    <aside className="flex flex-col h-screen w-64 bg-slate-800 text-white shadow-lg">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="text-3xl font-extrabold mb-10 mt-8 text-center tracking-tight text-white drop-shadow">
          <div className="flex justify-center mb-2">
            <Image src="/favicon.ico" alt="Logo" width={64} height={64} />
          </div>
          Devoluções R3
        </div>
        <nav className="flex-1 flex flex-col gap-2 px-4 min-h-0 overflow-y-auto">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={`rounded-lg px-4 py-3 font-medium transition-all
                ${pathname === link.href
                  ? "bg-green-500 text-white shadow"
                  : "hover:bg-gray-600 hover:text-green-200"
                }
              `}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="px-4 pb-8">
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-3 font-semibold shadow transition cursor-pointer"
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>
    </aside>
  );
}