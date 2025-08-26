import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

interface ProdutoDevolvido {
  cod_prod: number;
  descricao: string;
  quantidade_devolvida: number;
}

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

    // Buscar solicitações aprovadas/finalizadas para esta NF
    const solicitacoesAprovadas = await db.solicitacoes.findMany({
      where: {
        numero_nf: numero_nf,
        status: {
          in: ['aprovada', 'finalizada'] // Só considera devoluções efetivas
        }
      },
      select: {
        id: true,
        status: true
      }
    });

    if (solicitacoesAprovadas.length === 0) {
      return NextResponse.json({
        produtos_devolvidos: []
      });
    }

    // Buscar produtos devolvidos das solicitações aprovadas
    const produtosJaDevolvidos = await db.returned_products.findMany({
      where: {
        numeronf: numero_nf,
      }
    });

    // Agrupar por produto e somar quantidades já devolvidas
    const produtosAgrupados = produtosJaDevolvidos.reduce((acc, produto) => {
      const key = produto.cod_prod.toString();
      if (!acc[key]) {
        acc[key] = {
          cod_prod: produto.cod_prod,
          descricao: produto.descricao,
          quantidade_devolvida: 0
        };
      }
      acc[key].quantidade_devolvida += produto.quantidade;
      return acc;
    }, {} as Record<string, ProdutoDevolvido>);

    return NextResponse.json({
      produtos_devolvidos: Object.values(produtosAgrupados)
    });
  } catch (error) {
    console.error("Erro ao buscar produtos devolvidos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
