'use client';
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Início", icon: "🏠" },
  { href: "/solicitacoes", label: "Solicitações", icon: "📄" },
  { href: "/criar-solicitacao", label: "Criar Solicitação", icon: "➕" },
  { href: "/usuarios", label: "Usuários", icon: "👤" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  return (
    <aside
      className={`
        group/sidebar
        fixed md:static
        z-40
        flex flex-col h-full
        bg-slate-800 text-white shadow-lg
        transition-all duration-300
        w-16 hover:w-64 md:w-16 md:hover:w-64
        overflow-x-hidden
      `}
    >
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-col items-center md:items-stretch">
          <div className="flex flex-col items-center justify-center mb-2 mt-8">
            <Image src="/favicon.ico" alt="Logo" width={40} height={40} />
            <div
              className={`
                h-10 flex items-center justify-center
                transition-all duration-300
                w-0 group-hover/sidebar:w-[180px]
                overflow-hidden
                mt-2
              `}
            >
              <span className="text-2xl font-extrabold text-center tracking-tight text-white drop-shadow whitespace-nowrap">
                Devoluções R3
              </span>
            </div>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-2 px-2 min-h-0 overflow-y-auto mt-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={`
                flex items-center gap-3 rounded-lg px-3 py-3 font-medium transition-all
                ${pathname === link.href
                  ? "bg-green-600 text-white shadow"
                  : "hover:bg-gray-600"
                }
              `}
            >
              <span className="text-xl">{link.icon}</span>
              <div
                className={`
                  h-6 flex items-center
                  transition-all duration-300
                  w-0 group-hover/sidebar:w-[120px]
                  overflow-hidden
                `}
              >
                <span className="whitespace-nowrap">{link.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>
      <div className="px-2 pb-8">
        <button
          className={`
            w-full bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-3 font-semibold shadow transition cursor-pointer
            flex items-center
            h-14
            justify-center items-center
            group-hover/sidebar:justify-start
          `}
          onClick={handleLogout}
        >
          <span className="text-xl flex-shrink-0 flex items-center justify-center">
            ⏻
          </span>
          <div
            className={`
              h-6 flex items-center
              transition-all duration-300
              w-0 group-hover/sidebar:w-[60px]
              overflow-hidden
              ml-0 group-hover/sidebar:ml-2
            `}
          >
            <span className="whitespace-nowrap">Sair</span>
          </div>
        </button>
      </div>
    </aside>
  );
}