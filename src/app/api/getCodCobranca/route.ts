export const fetchCache = 'force-no-store';
// import { PrismaClient } from '@prisma/client';

import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
    try {
        const lista_cod_cobranca = await db.lista_codigos_cobranca.findMany();

        if (!lista_cod_cobranca || lista_cod_cobranca.length === 0) {
            console.log('Lista de códigos de cobrança não encontrada');
            return NextResponse.json([], { status: 404 }); // Retorne um array vazio em vez de um objeto
        }

        console.log('Lista de códigos de cobrança encontrada!\n Quantidade de Códigos:', lista_cod_cobranca.length);
        return NextResponse.json(lista_cod_cobranca); // Retorne diretamente o array de Códigos
    } catch (error) {
        console.error('Erro ao buscar Códigos de cobrança:', error);
        return NextResponse.json({ error: 'Erro ao buscar Códigos de cobrança' }, { status: 500 });
    }
}