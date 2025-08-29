export interface PermissionPreset {
  id: number;
  name: string;
  description?: string | null;
  permissions: { id: number; permission: { id: number; name: string; label: string; category: string; description?: string | null } }[];
  _count?: { users: number };
}

export async function fetchPermissionPresets(): Promise<PermissionPreset[]> {
  const res = await fetch('/api/permission-presets');
  if (!res.ok) throw new Error('Erro ao carregar presets');
  return res.json();
}

export async function createPermissionPreset(data: { name: string; description?: string; permissions: number[] }) {
  const res = await fetch('/api/permission-presets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Erro ao criar preset');
  return res.json();
}

export async function updatePermissionPreset(id: number, data: { name?: string; description?: string; permissions?: number[] }) {
  const res = await fetch(`/api/permission-presets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Erro ao atualizar preset');
  return res.json();
}

export async function deletePermissionPreset(id: number) {
  const res = await fetch(`/api/permission-presets/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error((await res.json()).error || 'Erro ao excluir preset');
  return res.json();
}
