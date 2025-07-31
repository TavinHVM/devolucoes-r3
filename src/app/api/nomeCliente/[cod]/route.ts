import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const codClient = url.pathname.split("/").pop();
    let connection;

    console.log("Importando oracledb...");
    const oracledb = (await import("oracledb")).default;

    try {
        console.log('Connecting to Oracle database...');
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_HOST
        });

        console.log('Executando consulta para o Cliente:', codClient);
        const result = await connection.execute(
            `SELECT CLIENTE FROM PCCLIENT WHERE CODCLI = :cod`,
        [codClient]
        );

        if (!result.rows || result.rows.length === 0) {
        return NextResponse.json({ nome: null }, { status: 404 });
        }

        const row = result.rows[0] as unknown[];
        const nameClient = row[0] as string;
        console.log("Nome do Cliente:", nameClient);

        return NextResponse.json({ nameClient });
    } catch (err) {
        console.error("Erro Oracle:", err);
        return NextResponse.json({ error: "Erro ao buscar cliente" }, { status: 500 });
    } finally {
        if (connection) await connection.close();
    }
}
