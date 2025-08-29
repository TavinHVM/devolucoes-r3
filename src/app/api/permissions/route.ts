import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const permissions = await db.permissions.findMany({
      orderBy: [
        { category: 'asc' },
        { label: 'asc' }
      ]
    });

    return NextResponse.json(permissions);
  } catch (error) {
    console.error('Erro ao buscar permissões:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
