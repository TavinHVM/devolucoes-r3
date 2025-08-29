import { useState } from 'react';
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
import { UserPlus } from 'lucide-react';
import { CreateUserForm } from './types';
import { PermissionsSelect } from './PermissionsSelect';
import { PermissionPresetsManager } from './PermissionPresetsManager';
import { PermissionPreset } from '@/utils/permissions/presetsApi';

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: CreateUserForm) => Promise<boolean>;
}

export function CreateUserModal({ open, onOpenChange, onSubmit }: CreateUserModalProps) {
  const [form, setForm] = useState<CreateUserForm>({
    first_name: '',
    last_name: '',
    role: '',
    user_level: '',
    email: '',
    password: '',
    permissions: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(form);
    if (success) {
      setForm({
        first_name: '',
        last_name: '',
        role: '',
        user_level: '',
        email: '',
        password: '',
        permissions: [],
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <UserPlus className="h-5 w-5" />
            Cadastrar Novo Usuário
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name" className="text-slate-300 mb-2">Nome</Label>
              <Input
                id="first_name"
                value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name" className="text-slate-300 mb-2">Sobrenome</Label>
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
            <Label htmlFor="email" className="text-slate-300 mb-2">E-mail</Label>
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
            <Label htmlFor="role" className="text-slate-300 mb-2">Cargo</Label>
            <Input
              id="role"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>
          
          <div className="w-full">
            <Label className="text-slate-300 mb-2">Nível de Acesso (Opcional)</Label>
              {/* Radix Select não permite <SelectItem value="">. Usamos um sentinela e convertemos para string vazia no estado. */}
              <CustomSelect
                value={form.user_level === '' ? '__custom__' : form.user_level}
                onValueChange={value =>
                  setForm(f => ({ ...f, user_level: value === '__custom__' ? '' : value }))
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-full">
                  <SelectValue placeholder="Selecione o nível (ou configure manualmente)" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="__custom__" className="text-white">Personalizado</SelectItem>
                  <SelectItem value="adm" className="text-white">Administrador</SelectItem>
                  <SelectItem value="vendas" className="text-white">Vendas</SelectItem>
                  <SelectItem value="financeiro" className="text-white">Financeiro</SelectItem>
                  <SelectItem value="logistica" className="text-white">Logística</SelectItem>
                  <SelectItem value="marketplace" className="text-white">Marketplace</SelectItem>
                </SelectContent>
              </CustomSelect>
          </div>

          <div className="space-y-6">
            <PermissionPresetsManager
              currentPermissions={form.permissions || []}
              onApplyPreset={(preset: PermissionPreset) => {
                setForm(f => ({ ...f, user_level: preset.name, permissions: preset.permissions.map(p => p.permission.id) }));
              }}
            />
            <PermissionsSelect
              selectedPermissions={form.permissions || []}
              onPermissionsChange={(permissions) => setForm(f => ({ ...f, permissions }))}
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-slate-300 mb-2">Senha</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="bg-slate-700 border-slate-600 text-slate-300">
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
