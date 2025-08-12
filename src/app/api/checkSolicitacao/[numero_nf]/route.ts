import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { numero_nf: string } }
) {
  try {
    const { numero_nf } = await params;

    if (!numero_nf) {
      return NextResponse.json(
        { error: "Número da NF é obrigatório" },
        { status: 400 }
      );
    }

    // Busca solicitações existentes com este número de NF
    const solicitacoesExistentes = await db.solicitacoes.findMany({
      where: {
        numero_nf: numero_nf,
      },
      select: {
        id: true,
        numero_nf: true,
        status: true,
        created_at: true,
        nome: true,
        cod_cliente: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json({
      existe: solicitacoesExistentes.length > 0,
      solicitacoes: solicitacoesExistentes,
      total: solicitacoesExistentes.length,
    });
  } catch (error) {
    console.error("Erro ao verificar solicitações existentes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
