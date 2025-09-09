import { NextRequest, NextResponse } from "next/server";
import { getApiUrl, logEnvironmentStatus } from "@/lib/env-check";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ numnota: string }> }
) {
  try {
    // Log do status do ambiente na primeira execução
    logEnvironmentStatus();
    
    const { numnota } = await params;
    
    if (!numnota) {
      return NextResponse.json(
        { error: "Número da nota fiscal é obrigatório" },
        { status: 400 }
      );
    }

    // Validação específica para NFs de 4 ou 6 dígitos
    if (!/^(\d{4}|\d{6})$/.test(numnota)) {
      return NextResponse.json(
        { error: "Número da NF deve ter 4 ou 6 dígitos" },
        { status: 400 }
      );
    }

    console.log(`Buscando informações para NF: ${numnota} (${numnota.length} dígitos)`);
    
    // Faz a requisição para a API externa
    const externalApiUrl = getApiUrl();
    
    console.log(`URL da API externa: ${externalApiUrl}/devolucoes/${numnota}`);
    
    const response = await fetch(`${externalApiUrl}/devolucoes/${numnota}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Timeout específico para Vercel
      signal: AbortSignal.timeout(25000), // 25 segundos
    });

    console.log(`Status da resposta da API externa: ${response.status}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`NF ${numnota} não encontrada na API externa`);
        return NextResponse.json({ message: "NF não encontrada" }, { status: 404 });
      }
      const errorText = await response.text();
      console.error(`API externa retornou erro ${response.status}: ${errorText}`);
      throw new Error(`API externa retornou: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Dados recebidos da API externa:`, data);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Erro no proxy getInfosNF:", error);
    
    // Log mais detalhado para debug no Vercel
    if (error instanceof Error) {
      console.error("Erro detalhado:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    
    return NextResponse.json(
      { error: "Erro ao buscar informações da NF", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}
