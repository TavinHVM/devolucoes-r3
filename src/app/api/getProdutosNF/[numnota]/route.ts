import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const numnota = url.pathname.split("/").pop();
    let connection;

    console.log("Importando oracledb...");
    const oracledb = (await import("oracledb")).default;

    try {
        console.log("Connecting to Oracle database...");
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_HOST,
        });

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
