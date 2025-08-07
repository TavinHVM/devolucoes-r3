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
    const quantidadesDevolucaoJson = body.get("quantidadesDevolucao") as string;

    console.log("Produtos JSON recebido:", produtosJson);
    console.log("Quantidades Devolução JSON recebido:", quantidadesDevolucaoJson);

    if (!produtosJson) {
        return NextResponse.json(
            { error: "Dados dos produtos não fornecidos" },
            { status: 400 }
        );
    }

    if (!quantidadesDevolucaoJson) {
        return NextResponse.json(
            { error: "Quantidades de devolução não fornecidas" },
            { status: 400 }
        );
    }

    let produtos: Produto[];
    let quantidadesDevolucao: Record<string, number>;

    try {
        produtos = JSON.parse(produtosJson);
        quantidadesDevolucao = JSON.parse(quantidadesDevolucaoJson);
    } catch (parseError) {
        console.error("Erro ao fazer parse dos dados JSON:", parseError);
        return NextResponse.json(
            { error: "Dados dos produtos em formato inválido" },
            { status: 400 }
        );
    }

    // Validar se os arrays não estão vazios
    if (!Array.isArray(produtos) || produtos.length === 0) {
        return NextResponse.json(
            { error: "Lista de produtos não pode estar vazia" },
            { status: 400 }
        );
    }

    // Extrair produtos selecionados das quantidades de devolução
    const produtosSelecionados = Object.keys(quantidadesDevolucao).filter(
        codigo => quantidadesDevolucao[codigo] > 0
    );

    if (produtosSelecionados.length === 0) {
        return NextResponse.json(
            { error: "Pelo menos um produto deve ser selecionado para devolução" },
            { status: 400 }
        );
    }

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
        console.log("Produtos selecionados para filtro:", produtosSelecionados);
        console.log("Quantidades de devolução:", quantidadesDevolucao);
        console.log("Total de produtos:", produtos.length);
        
        const produtosRetornados = produtos
        .filter((produto: Produto) => {
            const isSelected = produtosSelecionados.includes(produto.codigo);
            console.log(`Produto ${produto.codigo}: ${isSelected ? 'selecionado' : 'não selecionado'}`);
            return isSelected;
        })
        .map((produto: Produto) => {
            const quantidadeDevolucao = quantidadesDevolucao[produto.codigo] || 0;
            return {
                numeronf: solicitacao.numero_nf,
                cod_prod: parseInt(produto.codigo),
                descricao: produto.descricao,
                quantidade: quantidadeDevolucao, // Usar a quantidade específica de devolução
                punit: parseInt(produto.punit),
            };
        });

        console.log("Produtos retornados para salvar:", produtosRetornados.length);

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
