export const fetchCache = 'force-no-store';
// import { PrismaClient } from '@prisma/client';

import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { validateUserPermission } from "@/utils/permissions/serverPermissions";

export async function POST(request: Request) {
    // Validate user permissions
    const permissionCheck = validateUserPermission(request as unknown as import('next/server').NextRequest, 'finalizar');
    
    if (!permissionCheck.success) {
        return NextResponse.json(
            { error: permissionCheck.error },
            { status: 403 }
        );
    }

    const url = new URL(request.url);
    try {
        const id: number = parseInt(url.pathname.split("/").pop() || '0', 10);

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

        const statusOnData = (solicitacao.status).toUpperCase();
        if (statusOnData !== "ABATIDA") {
            return NextResponse.json(
                { error: "Solicitação não está ABATIDA e não pode ser FINALIZADA." },
                { status: 400 }
            );
        }

        console.log('Solicitação encontrada!\n Id da Solicitação:', solicitacao.id);

        await db.solicitacoes.update({
            where: {
                id: id,
            },
            data: {
                status: "FINALIZADA",
                finalizada_at: new Date()
            }
        })

        console.log('Solicitação Finalizada!');
        return NextResponse.json(solicitacao); // Retorne diretamente a Solicitação
    } catch (error) {
        console.error('Erro ao buscar Solicitação:', error);
        return NextResponse.json({ error: 'Erro ao buscar Solicitação' }, { status: 500 });
    }
}