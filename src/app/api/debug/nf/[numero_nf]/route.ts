import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ numero_nf: string }> }
) {
  try {
    const { numero_nf } = await params;

    if (!numero_nf) {
      return NextResponse.json(
        { error: "Número da NF é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar todas as solicitações para esta NF
    const todasSolicitacoes = await db.solicitacoes.findMany({
      where: {
        numero_nf: numero_nf
      },
      select: {
        id: true,
        numero_nf: true,
        status: true,
        created_at: true,
        nome: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Buscar todos os produtos devolvidos para esta NF
    const todosRetornados = await db.returned_products.findMany({
      where: {
        numeronf: numero_nf
      },
      select: {
        id: true,
        numeronf: true,
        cod_prod: true,
        descricao: true,
        quantidade: true,
        created_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Buscar produtos na tabela products para esta NF
    const produtosNaNota = await db.products.findMany({
      where: {
        numeronf: numero_nf
      },
      select: {
        id: true,
        numeronf: true,
        cod_prod: true,
        descricao: true,
        quantidade: true,
        punit: true,
        created_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json({
      numero_nf,
      solicitacoes: todasSolicitacoes,
      produtos_devolvidos: todosRetornados,
      produtos_na_nota: produtosNaNota,
      resumo: {
        total_solicitacoes: todasSolicitacoes.length,
        total_produtos_devolvidos: todosRetornados.length,
        total_produtos_nota: produtosNaNota.length,
        solicitacoes_por_status: todasSolicitacoes.reduce((acc, sol) => {
          acc[sol.status] = (acc[sol.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    });
  } catch (error) {
    console.error("Erro ao buscar dados de debug:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
