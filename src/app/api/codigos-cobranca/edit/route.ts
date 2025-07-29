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

    const updatedCodigo = await prisma.lista_codigos_cobranca.update({
      where: { id: Number(id) },
      data: {
        codigo: data.codigo,
        nome: data.nome
      }
    });

    return NextResponse.json(updatedCodigo);
  } catch (error) {
    console.error('Erro ao editar código de cobrança:', error);
    return NextResponse.json(
      { error: 'Código de cobrança não encontrado ou erro ao editar' },
      { status: 500 }
    );
  }
}
