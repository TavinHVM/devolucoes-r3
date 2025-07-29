import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    
    console.log('ID e dados recebidos para edição:', id, data);

    if (!id) {
      return NextResponse.json(
        { error: 'ID é obrigatório' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user_profiles.update({
      where: { id: Number(id) },
      data: {
        ...data,
        updated_at: new Date()
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Erro ao editar usuário:', error);
    return NextResponse.json(
      { error: 'Usuário não encontrado ou erro ao editar' },
      { status: 500 }
    );
  }
}
