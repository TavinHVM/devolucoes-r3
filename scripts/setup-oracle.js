const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔧 Configurando Oracle Instant Client...");

// Verifica se estamos em ambiente de produção (Vercel)
const isProduction =
  process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

if (isProduction) {
  console.log(
    "📦 Ambiente de produção detectado - configurando Oracle Instant Client"
  );

  try {
    const projectRoot = process.cwd();
    const zipPath = path.join(projectRoot, "instantclient-basic.zip");
    const extractPath = path.join(projectRoot, "instantclient");

    // Verifica se o arquivo zip existe
    if (!fs.existsSync(zipPath)) {
      console.error(
        "❌ Arquivo instantclient-basic.zip não encontrado na raiz do projeto"
      );
      process.exit(1);
    }

    // Cria diretório para extrair
    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath, { recursive: true });
    }

    console.log("📂 Extraindo Oracle Instant Client...");

    // Extrai o arquivo zip
    execSync(`unzip -q "${zipPath}" -d "${extractPath}"`, { stdio: "inherit" });

    // Encontra o diretório extraído (geralmente instantclient_21_*)
    const extractedDirs = fs
      .readdirSync(extractPath)
      .filter(
        (dir) =>
          dir.startsWith("instantclient_") &&
          fs.statSync(path.join(extractPath, dir)).isDirectory()
      );

    if (extractedDirs.length === 0) {
      console.error(
        "❌ Nenhum diretório do Instant Client encontrado após extração"
      );
      process.exit(1);
    }

    const instantClientDir = path.join(extractPath, extractedDirs[0]);
    console.log(`📍 Oracle Instant Client extraído em: ${instantClientDir}`);

    // Configura as variáveis de ambiente
    process.env.LD_LIBRARY_PATH = `${instantClientDir}:${
      process.env.LD_LIBRARY_PATH || ""
    }`;
    process.env.ORACLE_HOME = instantClientDir;

    // Cria um arquivo de configuração para runtime
    const configPath = path.join(projectRoot, "oracle-config.json");
    fs.writeFileSync(
      configPath,
      JSON.stringify(
        {
          LD_LIBRARY_PATH: process.env.LD_LIBRARY_PATH,
          ORACLE_HOME: process.env.ORACLE_HOME,
          instantClientDir: instantClientDir,
        },
        null,
        2
      )
    );

    console.log("✅ Oracle Instant Client configurado com sucesso!");
    console.log(`🔗 LD_LIBRARY_PATH: ${process.env.LD_LIBRARY_PATH}`);
    console.log(`🏠 ORACLE_HOME: ${process.env.ORACLE_HOME}`);
  } catch (error) {
    console.error(
      "❌ Erro ao configurar Oracle Instant Client:",
      error.message
    );

    // Em caso de erro, tenta uma abordagem alternativa
    console.log("🔄 Tentando abordagem alternativa...");
    try {
      // Define variáveis básicas mesmo sem extração
      const fallbackPath = "/tmp/instantclient";
      process.env.LD_LIBRARY_PATH = `${fallbackPath}:${
        process.env.LD_LIBRARY_PATH || ""
      }`;
      process.env.ORACLE_HOME = fallbackPath;

      console.log("⚠️ Configuração de fallback aplicada");
    } catch (fallbackError) {
      console.error(
        "❌ Falha na configuração de fallback:",
        fallbackError.message
      );
      process.exit(1);
    }
  }
} else {
  console.log(
    "🏠 Ambiente de desenvolvimento - Oracle Instant Client local será usado"
  );
}

console.log("🎯 Configuração do Oracle concluída");
