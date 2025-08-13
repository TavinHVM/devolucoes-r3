import fs from "fs";
import path from "path";

interface OracleConfig {
  LD_LIBRARY_PATH?: string;
  ORACLE_HOME?: string;
  instantClientDir?: string;
}

let oracleConfigured = false;
// Minimal pool shape to avoid depending on full oracledb types
interface OraclePoolLike {
  getConnection: () => Promise<unknown>;
}
let oraclePool: OraclePoolLike | null = null;

export function configureOracleClient(): void {
  if (oracleConfigured) return;

  const isProduction =
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  if (isProduction) {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log("🔧 Configurando Oracle Client para produção...");
      }

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

        if (process.env.NODE_ENV !== 'production') {
          console.log("✅ Configuração Oracle carregada do arquivo");
        }
      } else {
        // Configuração manual para Vercel
        const vercelOraclePath = "/tmp/instantclient";
        process.env.LD_LIBRARY_PATH = `${vercelOraclePath}:${
          process.env.LD_LIBRARY_PATH || ""
        }`;
        process.env.ORACLE_HOME = vercelOraclePath;
        if (process.env.NODE_ENV !== 'production') {
          console.log("⚡ Configuração Oracle manual aplicada para Vercel");
        }
      }

      // Configurações adicionais para o Oracle Client
      process.env.ORA_SDTZ = "UTC";
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          "⚠️ Aviso: Não foi possível configurar Oracle Client:",
          error
        );
      }
    }
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.log("🏠 Ambiente local - usando configuração Oracle padrão");
    }
  }

  oracleConfigured = true;
}

export async function getOracleConnection() {
  // Configura o Oracle antes de importar
  configureOracleClient();

  try {
    const oracledb = (await import("oracledb")).default;

    // Inicializa pool uma única vez
    if (!oraclePool) {
      oraclePool = await oracledb.createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_HOST,
        poolMin: 1,
        poolMax: 10,
        poolIncrement: 1,
        queueTimeout: 60000,
      });
    }

  const connection = await oraclePool.getConnection();
  return { oracledb, connection };
  } catch (error) {
    console.error("❌ Erro ao conectar com Oracle:", error);
    throw error;
  }
}
