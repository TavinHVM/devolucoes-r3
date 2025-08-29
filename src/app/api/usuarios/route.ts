import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/db';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const usuarios = await db.user_profiles.findMany({
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });

        if (!usuarios || usuarios.length === 0) {
            console.log('Usuários não encontrados!');
            return NextResponse.json([], { status: 404 });
        }

        console.log('Usuários encontrados!\n Quantidade de Usuários:', usuarios.length);
        return NextResponse.json(usuarios);
    } catch (error) {
        console.error('Erro ao buscar Usuários:', error);
        return NextResponse.json({ error: 'Erro ao buscar Usuários' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { first_name, last_name, email, role, user_level, password, permissions } = body;

        // Verificar se o email já existe
        const existingUser = await db.user_profiles.findFirst({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'E-mail já está em uso' },
                { status: 400 }
            );
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário
        const newUser = await db.user_profiles.create({
            data: {
                first_name,
                last_name,
                email,
                role,
                user_level: user_level || null,
                password: hashedPassword,
            }
        });

        // Adicionar permissões se fornecidas
        if (permissions && Array.isArray(permissions) && permissions.length > 0) {
            await db.user_permissions.createMany({
                data: permissions.map((permissionId: number) => ({
                    user_id: newUser.id,
                    permission_id: permissionId
                }))
            });
        }

        // Buscar usuário com permissões para retornar
        const userWithPermissions = await db.user_profiles.findUnique({
            where: { id: newUser.id },
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });

        return NextResponse.json(userWithPermissions, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
