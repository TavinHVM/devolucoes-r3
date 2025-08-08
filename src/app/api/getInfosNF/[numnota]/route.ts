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
                p.CODCLI,
                p.NUMCAR,
                p.CODUSUR,
                p.CODCOB,
                p.COBRANCA,
                p.CLIENTE,
                p.CODFILIAL,
                p2.CGCENT 
            FROM
                PCNFSAID p
            INNER JOIN PCCLIENT p2 ON
                p2.CODCLI = p.CODCLI 
            WHERE
                p.NUMNOTA = :numnota`,
      [numnota]
    );

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ nome: null }, { status: 404 });
    }

    const row = result.rows[0] as unknown[];

    // Mapeando os campos baseado na ordem do SELECT
    const infosNF = {
      codcli: row[0] as string,
      numcar: row[1] as string,
      codusur: row[2] as string,
      codcob: row[3] as string,
      cobranca: row[4] as string,
      cliente: row[5] as string,
      codfilial: row[6] as string,
      cgcent: row[7] as string,
    };

    console.log("Informações da NF:", infosNF);

    return NextResponse.json(infosNF);
  } catch (err) {
    console.error("Erro Oracle:", err);
    return NextResponse.json(
      { error: "Erro ao buscar cliente" },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.close();
  }
}
