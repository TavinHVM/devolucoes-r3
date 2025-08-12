import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const numnota = url.pathname.split("/").pop();
  
  try {
    // Faz a requisição para a API externa
    const externalApiUrl = process.env.API_URL || "http://192.168.7.104:3001/api";
    const response = await fetch(`${externalApiUrl}/devolucoes/${numnota}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ message: "NF não encontrada" }, { status: 404 });
      }
      throw new Error(`API externa retornou: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Erro no proxy getInfosNF:", error);
    return NextResponse.json(
      { error: "Erro ao buscar informações da NF" },
      { status: 500 }
    );
  }
}
