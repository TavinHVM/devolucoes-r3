export const fetchCache = 'force-no-store';
// import { PrismaClient } from '@prisma/client';

import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
    try {
        const solicitacoes = await db.solicitacoes.findMany();

        if (!solicitacoes || solicitacoes.length === 0) {
        console.log('Solicitações não encontradas');
        return NextResponse.json([], { status: 404 }); // Retorne um array vazio em vez de um objeto
        }

        console.log('Solicitações encontradas!\n Quantidade de Solicitações:', solicitacoes.length);
        return NextResponse.json(solicitacoes); // Retorne diretamente o array de Solicitações
    } catch (error) {
        console.error('Erro ao buscar Solicitações:', error);
        return NextResponse.json({ error: 'Erro ao buscar Solicitações' }, { status: 500 });
    }
}