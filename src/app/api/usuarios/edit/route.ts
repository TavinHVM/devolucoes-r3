import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';

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

    // Se uma nova senha foi fornecida, fazer hash dela
    const updateData = { ...data };
    if (data.password && data.password.trim() !== '') {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(data.password, saltRounds);
    } else {
      // Se não foi fornecida senha, remover do objeto de atualização
      delete updateData.password;
    }

    const updatedUser = await db.user_profiles.update({
      where: { id: Number(id) },
      data: {
        ...updateData,
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
