import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    console.log('ID recebido para exclusão:', id);

    if (!id) {
      console.error('ID não fornecido na requisição');
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const deletedUser = await prisma.user_profiles.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json(
      { error: 'Usuário não encontrado ou erro ao excluir' },
      { status: 500 }
    );
  }
}
