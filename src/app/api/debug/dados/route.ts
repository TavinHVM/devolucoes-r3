import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // Buscar todas as solicitações
    const todasSolicitacoes = await db.solicitacoes.findMany({
      select: {
        id: true,
        numero_nf: true,
        status: true,
        created_at: true,
        nome: true
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 10
    });

    // Buscar todos os produtos devolvidos
    const todosRetornados = await db.returned_products.findMany({
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
      },
      take: 10
    });

    return NextResponse.json({
      solicitacoes: todasSolicitacoes,
      produtos_devolvidos: todosRetornados,
      total_solicitacoes: todasSolicitacoes.length,
      total_produtos_devolvidos: todosRetornados.length
    });
  } catch (error) {
    console.error("Erro ao buscar dados de teste:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
