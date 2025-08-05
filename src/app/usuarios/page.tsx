'use client';
import { useEffect, useState } from 'react';
import Header from '../../components/header';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import {
  Select as CustomSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '../../components/ui/select';
import { fetchUsuarios } from '../../utils/usuarios/fetchUsuarios';
import { createUser, editUser as editUserAPI, deleteUser } from '../../utils/usuarios/apiUtils';
import { 
  Users, 
  UserPlus, 
  Edit2, 
  Trash2, 
  Search, 
  Mail,
  Shield,
  User,
  Phone,
  Filter,
} from 'lucide-react';

// Tipo do usuário conforme a tabela user_profiles
export interface Usuario {
  id: string | number;
  first_name: string;
  last_name: string;
  role: string;
  user_level: string;
  created_at?: string;
  email: string;
}

// Toast Component
function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  return (
    <div className={`fixed z-50 bottom-6 right-6 min-w-[220px] max-w-xs px-4 py-3 rounded shadow-lg text-white font-bold transition-all animate-fade-in-up ${type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}
      role="alert">
      <div className="flex items-center justify-between gap-2">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-lg leading-none">×</button>
      </div>
    </div>
  );
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Omit<Usuario, 'id' | 'created_at'> & { password: string }>({
    first_name: '',
    last_name: '',
    role: '',
    user_level: '',
    email: '',
    password: '',
  });
  const [error] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<Usuario | null>(null);
  const [editForm, setEditForm] = useState<Omit<Usuario, 'id' | 'created_at'>>({
    first_name: '',
    last_name: '',
    role: '',
    user_level: '',
    email: '',
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchUsuariosList();
  }, []);


  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(form);
      setToast({ message: 'Usuário criado com sucesso!', type: 'success' });
      setShowModal(false);
      setForm({
        first_name: '',
        last_name: '',
        role: '',
        user_level: '',
        email: '',
        password: '',
      });
      fetchUsuariosList();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      setToast({ message: 'Erro ao criar usuário.', type: 'error' });
    }
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      await editUserAPI(Number(editUser.id), editForm);
      setToast({ message: 'Usuário editado com sucesso!', type: 'success' });
      setEditUser(null);
      fetchUsuariosList();
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      setToast({ message: 'Erro ao editar usuário.', type: 'error' });
    }
  };

  const handleDeleteUserConfirm = async (id: string) => {
    try {
      await deleteUser(id);
      setToast({ message: 'Usuário excluído com sucesso!', type: 'success' });
      setConfirmDeleteId(null);
      fetchUsuariosList(); // Refresh the user list
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      setToast({ message: 'Erro ao excluir usuário.', type: 'error' });
    }
  };

  const fetchUsuariosList = async () => {
    try {
      const data = await fetchUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao buscar os usuários:', error);
    }
  };

  const openEditModal = (usuario: Usuario) => {
    setEditUser(usuario);
    setEditForm({
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      role: usuario.role,
      user_level: usuario.user_level,
      email: usuario.email,
    });
  };

  // Função para obter as iniciais do nome
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const levelBadgeConfig = {
    adm: {
      bgColor: '#dc2626',     // Vermelho hexadecimal
      textColor: '#ffffff'    // Branco hexadecimal
    },
    vendas: {
      bgColor: '#3b82f6',     // Azul hexadecimal
      textColor: '#ffffff'    // Branco hexadecimal
    },
    financeiro: {
      bgColor: '#059669',     // Verde hexadecimal
      textColor: 'text-white' // Branco Tailwind (mixed)
    },
    logistica: {
      bgColor: '#f97316',     // Laranja hexadecimal
      textColor: '#ffffff'    // Branco hexadecimal
    },
    default: {
      bgColor: '#6b7280',     // Cinza hexadecimal
      textColor: '#ffffff'    // Branco hexadecimal
    }
  };

  // Função para obter classes customizadas do badge baseada no nível
  const getLevelBadgeClass = (level: string) => {
    const config = levelBadgeConfig[level.toLowerCase() as keyof typeof levelBadgeConfig] || levelBadgeConfig.default;
    
    let classes = [];
    
    // Adiciona bgColor se for classe Tailwind
    if (!config.bgColor.startsWith('#')) {
      classes.push(config.bgColor);
    }
    
    // Adiciona textColor se for classe Tailwind
    if (!config.textColor.startsWith('#')) {
      classes.push(config.textColor);
    }
    
    // Remove border e adiciona classes padrão para badges customizados
    classes.push('border-0');
    
    // Força remoção de qualquer hover effect
    classes.push('hover:bg-current', 'hover:text-current', 'transition-none');
    
    return classes.join(' ');
  };

  // Função para obter o estilo inline quando usar cores hexadecimais
  const getLevelBadgeStyle = (level: string) => {
    const config = levelBadgeConfig[level.toLowerCase() as keyof typeof levelBadgeConfig] || levelBadgeConfig.default;
    
    // Sempre aplica estilos para desabilitar hover, independente do tipo de cor
    const baseStyle: React.CSSProperties = {
      border: 'none',
      transition: 'none',
      cursor: 'default'
    };
    
    // Se bgColor ou textColor for hexadecimal, usa inline styles
    const needsInlineStyle = config.bgColor.startsWith('#') || config.textColor.startsWith('#');
    
    if (needsInlineStyle) {
      let backgroundColor = config.bgColor;
      let textColor = config.textColor;
      
      // Converte bgColor se for Tailwind para a cor correspondente
      if (!backgroundColor.startsWith('#')) {
        // Mantém a classe Tailwind se não for hex
        backgroundColor = '';
      }
      
      // Converte textColor se necessário
      if (textColor.includes('white')) {
        textColor = '#ffffff';
      } else if (textColor.includes('black')) {
        textColor = '#000000';
      } else if (!textColor.startsWith('#')) {
        textColor = '#ffffff'; // fallback
      }
      
      if (backgroundColor) {
        baseStyle.backgroundColor = backgroundColor;
      }
      
      if (textColor) {
        baseStyle.color = textColor;
      }
    }
    
    return baseStyle;
  };

  // Filtrar usuários baseado na busca e nível selecionado
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = 
      usuario.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === 'all' || usuario.user_level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      {/* Toast Overlay */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Gerenciar Usuários</h1>
              <p className="text-slate-400">Administre os usuários do sistema</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total de Usuários</p>
                  <p className="text-2xl font-bold text-white">{usuarios.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Shield className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Administradores</p>
                  <p className="text-2xl font-bold text-white">{usuarios.filter(u => u.user_level === 'adm').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <User className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Vendas</p>
                  <p className="text-2xl font-bold text-white">{usuarios.filter(u => u.user_level === 'vendas').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Phone className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Outros</p>
                  <p className="text-2xl font-bold text-white">{usuarios.filter(u => !['adm', 'vendas'].includes(u.user_level)).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Ações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <div className="relative ml-4 mb-2">
                  <Label htmlFor="search" className="text-slate-300">Buscar usuários</Label>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 ml-4" />
                  <Input
                    id="search"
                    placeholder="Nome, email, cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ml-4"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48 ml-4">
                <div className='mb-2'>
                  <Label className="text-slate-300">Filtrar por nível</Label>
                </div>
                <CustomSelect value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Todos os níveis" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all" className="text-white">Todos os níveis</SelectItem>
                    <SelectItem value="adm" className="text-white">Administrador</SelectItem>
                    <SelectItem value="vendas" className="text-white">Vendas</SelectItem>
                    <SelectItem value="financeiro" className="text-white">Financeiro</SelectItem>
                    <SelectItem value="logistica" className="text-white">Logística</SelectItem>
                  </SelectContent>
                </CustomSelect>
              </div>
              
              <div className="mr-4">
                <Button 
                  onClick={() => setShowModal(true)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Lista de Usuários ({filteredUsuarios.length})
            </CardTitle>
            <CardDescription className="text-slate-400">
              Gerencie todos os usuários do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-700/30">
                  <TableHead className="text-slate-300">Usuário</TableHead>
                  <TableHead className="text-slate-300">Contato</TableHead>
                  <TableHead className="text-slate-300">Cargo</TableHead>
                  <TableHead className="text-slate-300">Nível</TableHead>
                  <TableHead className="text-slate-300 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-500/20 text-blue-400 font-semibold">
                              {getInitials(usuario.first_name, usuario.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">
                              {usuario.first_name} {usuario.last_name}
                            </p>
                            <p className="text-sm text-slate-400">ID: {String(usuario.id).slice(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-300">{usuario.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-slate-300">{usuario.role}</p>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`capitalize ${getLevelBadgeClass(usuario.user_level)} !hover:bg-current !hover:text-current !hover:opacity-100 hover:shadow-none cursor-default select-none`}
                          style={getLevelBadgeStyle(usuario.user_level)}
                        >
                          {usuario.user_level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(usuario)}
                            className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmDeleteId(String(usuario.id))}
                            className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal de criação */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <UserPlus className="h-5 w-5" />
                Cadastrar Novo Usuário
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name" className="text-slate-300">Nome</Label>
                  <Input
                    id="first_name"
                    value={form.first_name}
                    onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name" className="text-slate-300">Sobrenome</Label>
                  <Input
                    id="last_name"
                    value={form.last_name}
                    onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-slate-300">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="role" className="text-slate-300">Cargo</Label>
                <Input
                  id="role"
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              
              <div>
                <Label className="text-slate-300">Nível de Acesso</Label>
                <CustomSelect value={form.user_level} onValueChange={value => setForm(f => ({ ...f, user_level: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="adm" className="text-white">Administrador</SelectItem>
                    <SelectItem value="vendas" className="text-white">Vendas</SelectItem>
                    <SelectItem value="financeiro" className="text-white">Financeiro</SelectItem>
                    <SelectItem value="logistica" className="text-white">Logística</SelectItem>
                  </SelectContent>
                </CustomSelect>
              </div>
              
              <div>
                <Label htmlFor="password" className="text-slate-300">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              
              {error && <div className="text-red-400 text-sm">{error}</div>}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="bg-slate-700 border-slate-600 text-slate-300">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Cadastrar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de edição */}
        <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white">
                <Edit2 className="h-5 w-5" />
                Editar Usuário
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_first_name" className="text-slate-300">Nome</Label>
                  <Input
                    id="edit_first_name"
                    value={editForm.first_name}
                    onChange={e => setEditForm(f => ({ ...f, first_name: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit_last_name" className="text-slate-300">Sobrenome</Label>
                  <Input
                    id="edit_last_name"
                    value={editForm.last_name}
                    onChange={e => setEditForm(f => ({ ...f, last_name: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit_email" className="text-slate-300">E-mail</Label>
                <Input
                  id="edit_email"
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit_role" className="text-slate-300">Cargo</Label>
                <Input
                  id="edit_role"
                  value={editForm.role}
                  onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              
              <div>
                <Label className="text-slate-300">Nível de Acesso</Label>
                <CustomSelect value={editForm.user_level} onValueChange={value => setEditForm(f => ({ ...f, user_level: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="adm" className="text-white">Administrador</SelectItem>
                    <SelectItem value="vendas" className="text-white">Vendas</SelectItem>
                    <SelectItem value="financeiro" className="text-white">Financeiro</SelectItem>
                    <SelectItem value="logistica" className="text-white">Logística</SelectItem>
                  </SelectContent>
                </CustomSelect>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditUser(null)} className="bg-slate-700 border-slate-600 text-slate-300">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmação de exclusão */}
        <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-400">
                <Trash2 className="h-5 w-5" />
                Confirmar Exclusão
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-slate-300">
                Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDeleteId(null)} className="bg-slate-700 border-slate-600 text-slate-300">
                Cancelar
              </Button>
              <Button onClick={() => confirmDeleteId && handleDeleteUserConfirm(confirmDeleteId)} className="bg-red-600 hover:bg-red-700">
                Confirmar Exclusão
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}