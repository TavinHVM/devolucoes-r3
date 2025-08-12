import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const numnota = url.pathname.split("/").pop();

  try {
    // Faz a requisição para a API externa
    const externalApiUrl =
      process.env.API_URL || "http://192.168.7.104:3001/api";
    const response = await fetch(`${externalApiUrl}/produtos/${numnota}`);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ produtos: [] }, { status: 200 });
      }
      throw new Error(`API externa retornou: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro no proxy getProdutosNF:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos da NF" },
      { status: 500 }
    );
  }
}
