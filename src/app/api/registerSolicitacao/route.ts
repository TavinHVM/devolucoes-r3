export const fetchCache = "force-no-store";
// import { PrismaClient } from '@prisma/client';

import { NextResponse } from "next/server";
import db from "../../../lib/db";

interface Produto {
    codigo: string;
    descricao: string;
    quantidade: string;
    punit: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.formData();

        // Processar arquivo da nota fiscal se existir
        const arquivoNF = body.get("arquivo_nf") as File | null;
        let arquivoNFBuffer: Buffer | null = null;

        if (arquivoNF) {
            const arrayBuffer = await arquivoNF.arrayBuffer();
            arquivoNFBuffer = Buffer.from(arrayBuffer);
        }

        // Dados da solicitação
        const solicitacaoToCreate = {
        nome: body.get("nome") as string,
        filial: body.get("filial") as string,
        numero_nf: body.get("numero_nf") as string,
        carga: body.get("carga") as string,
        nome_cobranca: body.get("nome_cobranca") as string,
        cod_cobranca: body.get("cod_cobranca") as string,
        rca: parseInt(body.get("rca") as string),
        cgent: body.get("cgent") as string,
        motivo_devolucao: body.get("motivo_devolucao") as string,
        tipo_devolucao: body.get("tipo_devolucao") as string,
        cod_cliente: parseInt(body.get("cod_cliente") as string),
        status: "PENDENTE",
        arquivo_nf: arquivoNFBuffer,
        };

    // Dados dos produtos (JSON string)
    const produtosJson = body.get("produtos") as string;
    const produtosSelecionadosJson = body.get("produtosSelecionados") as string;

    const produtos: Produto[] = JSON.parse(produtosJson);
    const produtosSelecionados: string[] = JSON.parse(produtosSelecionadosJson);

        // Usar transação para garantir consistência
        const result = await db.$transaction(async (tx) => {
        // 1. Criar a solicitação
        const solicitacao = await tx.solicitacoes.create({
            data: solicitacaoToCreate,
        });

        // 2. Salvar todos os produtos na tabela products
        const produtosToCreate = produtos.map((produto: Produto) => ({
            numeronf: solicitacao.numero_nf,
            cod_prod: parseInt(produto.codigo),
            descricao: produto.descricao,
            quantidade: parseInt(produto.quantidade),
            punit: parseInt(produto.punit),
        }));

        await tx.products.createMany({
            data: produtosToCreate,
        });

      // 3. Salvar apenas os produtos selecionados na tabela returned_products
        const produtosRetornados = produtos
        .filter((produto: Produto) =>
            produtosSelecionados.includes(produto.codigo)
        )
        .map((produto: Produto) => ({
            numeronf: solicitacao.numero_nf,
            cod_prod: parseInt(produto.codigo),
            descricao: produto.descricao,
            quantidade: parseInt(produto.quantidade),
            punit: parseInt(produto.punit),
        }));

        if (produtosRetornados.length > 0) {
            await tx.returned_products.createMany({
            data: produtosRetornados,
            });
        }

        return {
            solicitacao,
            produtosSalvos: produtos.length,
            produtosRetornados: produtosRetornados.length,
        };
    });

    console.log("Solicitação criada com sucesso! ID:", result.solicitacao.id);
    console.log(
    `Produtos salvos: ${result.produtosSalvos}, Produtos para devolução: ${result.produtosRetornados}`
    );

        return NextResponse.json(result);
    } catch (error) {
        console.error("Erro ao criar solicitação:", error);
        return NextResponse.json(
        { error: "Erro ao criar solicitação" },
        { status: 500 }
        );
    }
}
