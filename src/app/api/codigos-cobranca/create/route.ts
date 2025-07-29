import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('Dados recebidos para criação de código de cobrança:', data);

    if (!data.codigo || !data.nome) {
      return NextResponse.json(
        { error: 'Código e nome são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o código já existe
    const existingCode = await prisma.lista_codigos_cobranca.findFirst({
      where: { codigo: data.codigo }
    });

    if (existingCode) {
      return NextResponse.json(
        { error: 'Este código de cobrança já existe' },
        { status: 409 }
      );
    }

    const newCodigoCobranca = await prisma.lista_codigos_cobranca.create({
      data: {
        codigo: data.codigo,
        nome: data.nome
      }
    });

    return NextResponse.json(newCodigoCobranca);
  } catch (error) {
    console.error('Erro ao criar código de cobrança:', error);
    return NextResponse.json(
      { error: 'Erro ao criar código de cobrança' },
      { status: 500 }
    );
  }
}
