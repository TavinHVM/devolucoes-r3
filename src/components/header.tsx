'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getStoredUser, getUserDisplayName, logout, User } from "@/lib/auth";

// Ícones Lucide
import { Home, FileText, Plus, Users, Power, Receipt } from 'lucide-react';

const navLinks = [
  { href: "/", label: "Início", icon: <Home size={20} /> },
  { href: "/solicitacoes", label: "Solicitações", icon: <FileText size={20} /> },
  { href: "/criar-solicitacao", label: "Criar Solicitação", icon: <Plus size={20} /> },
  { href: "/criar-codcobranca", label: "Códigos Cobrança", icon: <Receipt size={20} /> },
  { href: "/usuarios", label: "Usuários", icon: <Users size={20} /> },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/usuarios/logout', {
        method: 'POST'
      });
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      logout(); // Faz logout local mesmo se houver erro no servidor
      router.push('/login');
    }
  };

  return (
    <>
      {/* Modal de Logout */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-slate-800 border-none">
          <DialogHeader>
            <DialogTitle className="text-white">Deseja realmente sair?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 justify-end">
            <Button
              variant="secondary"
              className="bg-gray-500 hover:bg-gray-600 text-white border-none cursor-pointer"
              onClick={() => setOpen(false)}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="bg-red-custom hover:bg-red-custom-hover text-white cursor-pointer"
              onClick={() => { handleLogout(); setOpen(false); }}
              type="button"
            >
              Sair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-800 text-white shadow-md w-full">
        {/* Logo e Nome */}
        <div className="flex items-center gap-3">
          <Image src="/favicon.ico" alt="Logo" width={50} height={50} className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="text-xl font-bold">Devoluções R3</span>
            {user && (
              <span className="text-sm text-gray-300">
                Olá, {getUserDisplayName(user)}
              </span>
            )}
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md transition
                ${pathname === link.href ? "bg-green-600 text-white" : "hover:bg-gray-600"}
              `}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          {/* Botão de Sair */}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-[#e94a4a] hover:bg-[#e94a4ae5] text-white px-3 py-2 rounded-md transition cursor-pointer"
          >
            <Power size={20} />
            <span>Sair</span>
          </button>
        </nav>
      </header>
    </>
  );
}
