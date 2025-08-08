import { NextRequest, NextResponse } from "next/server";
import { getOracleConnection } from "@/lib/oracle";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const numnota = url.pathname.split("/").pop();
  let connection;

  try {
    console.log("Estabelecendo conexão Oracle...");
    const { connection: oracleConnection } = await getOracleConnection();
    connection = oracleConnection;

    console.log("Executando consulta para o Cliente:", numnota);
    const result = await connection.execute(
      `SELECT
                CODPROD,
                DESCRICAO,
                QT,
                PUNIT
            FROM
                PCMOV p
            WHERE
                p.NUMNOTA = :numnota`,
      [numnota]
    );

    if (!result.rows || result.rows.length === 0) {
      console.log("Nenhum produto encontrado para NF:", numnota);
      return NextResponse.json({ produtos: [] }, { status: 200 });
    }

    // Mapeando TODAS as linhas para um array de produtos
    const produtos = result.rows.map((row: unknown) => {
      const rowData = row as unknown[];
      return {
        codprod: rowData[0] as string,
        descricao: rowData[1] as string,
        qt: rowData[2] as number,
        punit: rowData[3] as number,
      };
    });

    console.log("Produtos da NF:", produtos);

    return NextResponse.json({ produtos });
  } catch (err) {
    console.error("Erro Oracle:", err);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.close();
  }
}
