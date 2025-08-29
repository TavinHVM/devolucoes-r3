import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../lib/db';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest, context: unknown) {
  const { params } = context as { params: { id: string } };
  try {
    const { id } = params;
    const body = await request.json();
    const { first_name, last_name, email, role, user_level, password, permissions } = body;

    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID de usuário inválido' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const existingUser = await db.user_profiles.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o email já está em uso por outro usuário
    if (email && email !== existingUser.email) {
      const emailInUse = await db.user_profiles.findFirst({
        where: { 
          email,
          id: { not: userId }
        }
      });

      if (emailInUse) {
        return NextResponse.json(
          { error: 'E-mail já está em uso por outro usuário' },
          { status: 400 }
        );
      }
    }

    // Preparar dados para atualização
    const updateData: Record<string, string | null> = {};
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (user_level !== undefined) updateData.user_level = user_level || null;
    
    // Atualizar senha se fornecida
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Atualizar usuário
    await db.user_profiles.update({
      where: { id: userId },
      data: updateData
    });

    // Atualizar permissões se fornecidas
    if (permissions !== undefined && Array.isArray(permissions)) {
      // Remover permissões existentes
      await db.user_permissions.deleteMany({
        where: { user_id: userId }
      });

      // Adicionar novas permissões
      if (permissions.length > 0) {
        await db.user_permissions.createMany({
          data: permissions.map((permissionId: number) => ({
            user_id: userId,
            permission_id: permissionId
          }))
        });
      }
    }

    // Buscar usuário atualizado com permissões
    const userWithPermissions = await db.user_profiles.findUnique({
      where: { id: userId },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    return NextResponse.json(userWithPermissions);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: unknown) {
  const { params } = context as { params: { id: string } };
  try {
    const { id } = params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID de usuário inválido' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const existingUser = await db.user_profiles.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Excluir usuário (as permissões serão excluídas automaticamente devido ao onDelete: Cascade)
    await db.user_profiles.delete({
      where: { id: userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
