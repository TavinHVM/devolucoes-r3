export const fetchCache = 'force-no-store';
// import { PrismaClient } from '@prisma/client';

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    const url = new URL(request.url);
    try {
        const id: number = parseInt(url.pathname.split("/").pop() || '0', 10);
        // const { id } = await request.json();

        const solicitacao = await db.solicitacoes.findUnique({
            where: {
                id: id,
            },
            select:{
                status: true,
                id: true,
            }
        });

        if (!solicitacao) {
        console.log('Solicitação não encontrada');
        return NextResponse.json([], { status: 404 }); // Retorne um array vazio em vez de um objeto
        }
        console.log('Solicitações encontradas!\n Id da Solicitação:', solicitacao.id);

        await db.solicitacoes.update({
            where: {
                id: id,
            },
            data: {
                status: "RECUSADA",
            }
        })

        console.log('Solicitação Recusada!');
        return NextResponse.json(solicitacao); // Retorne diretamente a Solicitação
    } catch (error) {
        console.error('Erro ao buscar Solicitação:', error);
        return NextResponse.json({ error: 'Erro ao buscar Solicitação' }, { status: 500 });
    }
}