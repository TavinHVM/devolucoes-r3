import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select as CustomSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '../ui/select';
import { Edit2 } from 'lucide-react';
import { Usuario, EditUserForm } from './types';

interface EditUserModalProps {
  user: Usuario | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: number, form: EditUserForm) => Promise<boolean>;
}

export function EditUserModal({ user, onOpenChange, onSubmit }: EditUserModalProps) {
  const [form, setForm] = useState<EditUserForm>({
    first_name: '',
    last_name: '',
    role: '',
    user_level: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        user_level: user.user_level,
        email: user.email,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const success = await onSubmit(Number(user.id), form);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Edit2 className="h-5 w-5" />
            Editar Usuário
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit_first_name" className="text-slate-300">Nome</Label>
              <Input
                id="edit_first_name"
                value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_last_name" className="text-slate-300">Sobrenome</Label>
              <Input
                id="edit_last_name"
                value={form.last_name}
                onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
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
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="edit_role" className="text-slate-300">Cargo</Label>
            <Input
              id="edit_role"
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
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="bg-slate-700 border-slate-600 text-slate-300">
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
