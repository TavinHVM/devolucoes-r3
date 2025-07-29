import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('Dados recebidos para criação:', data);

    if (!data.first_name || !data.last_name || !data.email || !data.password || !data.role || !data.user_level) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const encryptedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user_profiles.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        password: encryptedPassword,
        role: data.role,
        user_level: data.user_level,
        email: data.email
      }
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}
