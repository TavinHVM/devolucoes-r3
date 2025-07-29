import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const codProd = url.pathname.split("/").pop();
    let connection;

    console.log("Importando oracledb...");
    const oracledb = (await import("oracledb")).default;

    // // Liberação do Instant Client no Windows
    // oracledb.initOracleClient({ libDir: "C:\\instantclient\\instantclient_23_5" });

    // // PARA UBUNTU
    // oracledb.initOracleClient({ libDir: '/bot/instantclient' });

    try {
        console.log('Connecting to Oracle database...');
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_HOST
        });

        console.log('Executando consulta para o Produto:', codProd);
        const result = await connection.execute(
            `SELECT CLIENTE FROM PCCLIENT WHERE CODCLI = :cod`,
        [codProd]
        );

        if (!result.rows || result.rows.length === 0) {
        return NextResponse.json({ nome: null }, { status: 404 });
        }

        const row = result.rows[0] as unknown[];
        const nameProd = row[0] as string;
        console.log("Nome do Produto:", nameProd);

        return NextResponse.json({ nameProd });
    } catch (err) {
        console.error("Erro Oracle:", err);
        return NextResponse.json({ error: "Erro ao buscar produto" }, { status: 500 });
    } finally {
        if (connection) await connection.close();
    }
}
