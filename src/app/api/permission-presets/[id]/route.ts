import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Tipagem simplificada para evitar conflito com tipos internos do Next 15
export async function PUT(request: NextRequest, context: unknown) {
  const { params } = context as { params: { id: string } };
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    const body = await request.json();
    const { name, description, permissions } = body as { name?: string; description?: string; permissions?: number[] };

    const existing = await db.permission_presets.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Preset não encontrado' }, { status: 404 });

    if (name && name !== existing.name) {
      const nameTaken = await db.permission_presets.findFirst({ where: { name } });
      if (nameTaken) return NextResponse.json({ error: 'Nome já em uso' }, { status: 400 });
    }

    await db.permission_presets.update({
      where: { id },
      data: { name: name ?? existing.name, description: description === undefined ? existing.description : description },
    });

    if (permissions) {
      // Reset associations
      await db.permission_preset_permissions.deleteMany({ where: { preset_id: id } });
      if (permissions.length) {
        await db.permission_preset_permissions.createMany({
          data: permissions.map(pid => ({ preset_id: id, permission_id: pid })),
        });
      }
    }

    const full = await db.permission_presets.findUnique({
      where: { id },
      include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } },
    });

    return NextResponse.json(full);
  } catch (error) {
    console.error('Erro ao atualizar preset:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: unknown) {
  const { params } = context as { params: { id: string } };
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    const existing = await db.permission_presets.findUnique({ where: { id }, include: { users: true } });
    if (!existing) return NextResponse.json({ error: 'Preset não encontrado' }, { status: 404 });

    if (existing.users.length) {
      return NextResponse.json({ error: 'Preset em uso por usuários' }, { status: 400 });
    }

    await db.permission_presets.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir preset:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
