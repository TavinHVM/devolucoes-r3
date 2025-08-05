export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { validateUserPermission } from "@/utils/permissions/serverPermissions";

export async function POST(request: Request) {
    // Validate user permissions
    const permissionCheck = validateUserPermission(request as unknown as import('next/server').NextRequest, 'desdobrar');
    
    if (!permissionCheck.success) {
        return NextResponse.json(
            { error: permissionCheck.error },
            { status: 403 }
        );
    }

    const url = new URL(request.url);
    try {
        const id: number = parseInt(url.pathname.split("/").pop() || "0", 10);

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
        if (statusOnData !== "APROVADA") {
            return NextResponse.json(
                { error: "Solicitação não está APROVADA e não pode ser DESDOBRADA." },
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
            status: "DESDOBRADA",
            desdobrada_at: new Date()
        },
        });

        console.log("Solicitação DESDOBRADA!");
        return NextResponse.json(solicitacao);
    } catch (error) {
        console.error("Erro ao buscar Solicitação:", error);
        return NextResponse.json(
        { error: "Erro ao buscar Solicitação" },
        { status: 500 }
        );
    }
}
