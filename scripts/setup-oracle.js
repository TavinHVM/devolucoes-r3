/* eslint-disable @typescript-eslint/no-require-imports */
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

    // URL para download do Oracle Instant Client Basic (Linux x64)
    const downloadUrl = "https://download.oracle.com/otn_software/linux/instantclient/211000/instantclient-basic-linux.x64-21.1.0.0.0.zip";

    // Baixa usando wget/curl se o arquivo não existir
    if (!fs.existsSync(zipPath)) {
      console.log("📥 Baixando Oracle Instant Client...");
      try {
        console.log("Tentando download com wget...");
        execSync(`wget -O "${zipPath}" "${downloadUrl}"`, { stdio: "inherit" });
      } catch {
        console.log("⚠️ wget falhou, tentando curl...");
        try {
          execSync(`curl -L -o "${zipPath}" "${downloadUrl}"`, { stdio: "inherit" });
        } catch (curlError) {
          console.error("❌ Falha no download com wget e curl");
          throw curlError;
        }
      }
      console.log("✅ Download concluído");
    } else {
      console.log("📦 Usando arquivo local existente");
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

    // Remove o arquivo zip após extração para economizar espaço
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
      console.log("🗑️ Arquivo zip removido após extração");
    }

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
