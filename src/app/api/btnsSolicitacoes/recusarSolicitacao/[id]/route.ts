export const fetchCache = "force-no-store";
// import { PrismaClient } from '@prisma/client';

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { validateUserPermission } from "@/utils/permissions/serverPermissions";

export async function POST(request: Request) {
    // Validate user permissions
    const permissionCheck = validateUserPermission(request as unknown as import('next/server').NextRequest, 'recusar');
    
    if (!permissionCheck.success) {
        return NextResponse.json(
            { error: permissionCheck.error },
            { status: 403 }
        );
    }

    const url = new URL(request.url);
    try {
        const id: number = parseInt(url.pathname.split("/").pop() || "0", 10);
        // const { id } = await request.json();

        const { motivo_recusa } = await request.json();

        const solicitacao = await db.solicitacoes.findUnique({
        where: {
            id: id,
        },
        select: {
            status: true,
            id: true,
        },
        });

        if (!solicitacao) {
        console.log("Solicitação não encontrada");
        return NextResponse.json([], { status: 404 });
        }

        const statusOnData = (solicitacao.status).toUpperCase();
        if (statusOnData !== "PENDENTE") {
            return NextResponse.json(
                { error: "Solicitação não está pendente e não pode ser recusada." },
                { status: 400 }
            );
        }

        console.log(
        "Solicitação encontrada!\n Id da Solicitação:",
        solicitacao.id
        );

        await db.solicitacoes.update({
        where: {
            id: id,
        },
        data: {
            status: "RECUSADA",
            recusada_at: new Date(),
            motivo_recusa: motivo_recusa
        },
        });

        console.log("Solicitação Recusada!");
        return NextResponse.json(solicitacao);
    } catch (error) {
        console.error("Erro ao buscar Solicitação:", error);
        return NextResponse.json(
        { error: "Erro ao buscar Solicitação" },
        { status: 500 }
        );
    }
}
