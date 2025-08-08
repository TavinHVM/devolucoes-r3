import fs from "fs";
import path from "path";

interface OracleConfig {
  LD_LIBRARY_PATH?: string;
  ORACLE_HOME?: string;
  instantClientDir?: string;
}

let oracleConfigured = false;

export function configureOracleClient(): void {
  if (oracleConfigured) return;

  const isProduction =
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  if (isProduction) {
    try {
      console.log("🔧 Configurando Oracle Client para produção...");

      // Tenta carregar configuração salva
      const configPath = path.join(process.cwd(), "oracle-config.json");

      if (fs.existsSync(configPath)) {
        const config: OracleConfig = JSON.parse(
          fs.readFileSync(configPath, "utf8")
        );

        if (config.LD_LIBRARY_PATH) {
          process.env.LD_LIBRARY_PATH = config.LD_LIBRARY_PATH;
        }
        if (config.ORACLE_HOME) {
          process.env.ORACLE_HOME = config.ORACLE_HOME;
        }

        console.log("✅ Configuração Oracle carregada do arquivo");
      } else {
        // Configuração manual para Vercel
        const vercelOraclePath = "/tmp/instantclient";
        process.env.LD_LIBRARY_PATH = `${vercelOraclePath}:${
          process.env.LD_LIBRARY_PATH || ""
        }`;
        process.env.ORACLE_HOME = vercelOraclePath;

        console.log("⚡ Configuração Oracle manual aplicada para Vercel");
      }

      // Configurações adicionais para o Oracle Client
      process.env.ORA_SDTZ = "UTC";
    } catch (error) {
      console.warn(
        "⚠️ Aviso: Não foi possível configurar Oracle Client:",
        error
      );
    }
  } else {
    console.log("🏠 Ambiente local - usando configuração Oracle padrão");
  }

  oracleConfigured = true;
}

export async function getOracleConnection() {
  // Configura o Oracle antes de importar
  configureOracleClient();

  try {
    console.log("📦 Importando oracledb...");
    const oracledb = (await import("oracledb")).default;

    console.log("🔗 Conectando ao Oracle...");
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_HOST,
    });

    console.log("✅ Conexão Oracle estabelecida");
    return { oracledb, connection };
  } catch (error) {
    console.error("❌ Erro ao conectar com Oracle:", error);
    throw error;
  }
}
