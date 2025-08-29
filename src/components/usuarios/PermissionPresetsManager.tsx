import React, { useEffect, useState } from 'react';
import { fetchPermissionPresets, createPermissionPreset, updatePermissionPreset, deletePermissionPreset, PermissionPreset } from '@/utils/permissions/presetsApi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { PermissionsSelect } from './PermissionsSelect';

interface PermissionPresetsManagerProps {
  onApplyPreset: (preset: PermissionPreset) => void;
  currentPermissions: number[];
}

export function PermissionPresetsManager({ onApplyPreset, currentPermissions }: PermissionPresetsManagerProps) {
  const [presets, setPresets] = useState<PermissionPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<{ name: string; description: string; permissions: number[] }>({ name: '', description: '', permissions: [] });

  const load = async () => {
    setLoading(true); setError(null);
    try {
      setPresets(await fetchPermissionPresets());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro inesperado');
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const startCreate = () => { setCreating(true); setEditingId(null); setForm({ name: '', description: '', permissions: currentPermissions }); };
  const startEdit = (p: PermissionPreset) => { setEditingId(p.id); setCreating(false); setForm({ name: p.name, description: p.description || '', permissions: p.permissions.map(pp => pp.permission.id) }); };
  const cancel = () => { setCreating(false); setEditingId(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updatePermissionPreset(editingId, { ...form, permissions: form.permissions });
      } else {
        await createPermissionPreset({ ...form, permissions: form.permissions });
      }
      cancel();
      await load();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Falha ao salvar preset'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este preset?')) return;
  try { await deletePermissionPreset(id); await load(); } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Falha ao excluir preset'); }
  };

  if (loading) return <div className="text-sm text-slate-400">Carregando presets...</div>;
  if (error) return <div className="text-sm text-red-400">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-200">Presets de Permissões</h3>
        <Button type="button" size="sm" onClick={startCreate}>Novo Preset</Button>
      </div>
      <div className="grid gap-3">
        {presets.map(p => (
          <Card key={p.id} className="bg-slate-700/40 border-slate-600">
            <CardHeader className="py-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-slate-200 flex items-center gap-2">
                  {p.name}
                  <span className="text-xs text-slate-400">{p.permissions.length} perm.</span>
                  {p._count?.users ? <span className="text-[10px] px-1 rounded bg-slate-600 text-slate-200">{p._count.users} usuários</span> : null}
                </CardTitle>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => onApplyPreset(p)}>Aplicar</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => startEdit(p)}>Editar</Button>
                  <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>Excluir</Button>
                </div>
              </div>
            </CardHeader>
            {p.description && <CardContent className="pt-0 text-xs text-slate-400">{p.description}</CardContent>}
          </Card>
        ))}
        {presets.length === 0 && <div className="text-xs text-slate-400">Nenhum preset criado.</div>}
      </div>

      {(creating || editingId) && (
        <form onSubmit={submit} className="space-y-3 rounded-md border border-slate-600 p-3 bg-slate-700/40">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-medium text-slate-300">{editingId ? 'Editar Preset' : 'Novo Preset'}</h4>
            <Button type="button" size="sm" variant="outline" onClick={cancel}>Cancelar</Button>
          </div>
          <div className="grid gap-2">
            <div>
              <Label className="text-xs">Nome</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="h-8 text-sm bg-slate-800 border-slate-600" required />
            </div>
            <div>
              <Label className="text-xs">Descrição (opcional)</Label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="h-8 text-sm bg-slate-800 border-slate-600" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Permissões do Preset</Label>
              {/* Reuso do componente existente para seleção detalhada */}
              <PermissionsSelect selectedPermissions={form.permissions} onPermissionsChange={perms => setForm(f => ({ ...f, permissions: perms }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit" size="sm">{editingId ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      )}
    </div>
  );
}
