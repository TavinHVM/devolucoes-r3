import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Lista todos os presets com suas permissões
export async function GET() {
  try {
    const presets = await db.permission_presets.findMany({
      include: {
        permissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(presets);
  } catch (error) {
    console.error('Erro ao listar presets:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// Cria um novo preset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, permissions } = body as {
      name: string; description?: string; permissions?: number[];
    };

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    // Verificar duplicidade
    const exists = await db.permission_presets.findFirst({ where: { name } });
    if (exists) {
      return NextResponse.json({ error: 'Já existe um preset com esse nome' }, { status: 400 });
    }

    const preset = await db.permission_presets.create({
      data: { name, description: description || null },
    });

    if (permissions && Array.isArray(permissions) && permissions.length) {
      await db.permission_preset_permissions.createMany({
        data: permissions.map(pid => ({ preset_id: preset.id, permission_id: pid })),
      });
    }

    const full = await db.permission_presets.findUnique({
      where: { id: preset.id },
      include: { permissions: { include: { permission: true } } },
    });

    return NextResponse.json(full, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar preset:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
