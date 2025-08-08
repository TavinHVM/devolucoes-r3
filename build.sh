#!/bin/bash

echo "🚀 Iniciando build customizado para Vercel..."

# Verifica se estamos na Vercel
if [ "$VERCEL" = "1" ]; then
    echo "📦 Ambiente Vercel detectado - configurando Oracle Instant Client"
    
    # Cria diretório temporário para o Oracle Client
    mkdir -p /tmp/instantclient
    
    # Verifica se o arquivo zip existe
    if [ -f "instantclient-basic.zip" ]; then
        echo "📂 Extraindo Oracle Instant Client..."
        
        # Extrai o arquivo zip
        unzip -q instantclient-basic.zip -d /tmp/instantclient/
        
        # Encontra o diretório extraído
        INSTANT_CLIENT_DIR=$(find /tmp/instantclient -name "instantclient_*" -type d | head -1)
        
        if [ -n "$INSTANT_CLIENT_DIR" ]; then
            echo "✅ Oracle Instant Client extraído em: $INSTANT_CLIENT_DIR"
            
            # Define variáveis de ambiente
            export LD_LIBRARY_PATH="$INSTANT_CLIENT_DIR:$LD_LIBRARY_PATH"
            export ORACLE_HOME="$INSTANT_CLIENT_DIR"
            
            echo "🔗 LD_LIBRARY_PATH: $LD_LIBRARY_PATH"
            echo "🏠 ORACLE_HOME: $ORACLE_HOME"
            
            # Salva configuração para runtime
            cat > oracle-config.json << EOF
{
  "LD_LIBRARY_PATH": "$LD_LIBRARY_PATH",
  "ORACLE_HOME": "$ORACLE_HOME",
  "instantClientDir": "$INSTANT_CLIENT_DIR"
}
EOF
            
        else
            echo "❌ Falha ao encontrar diretório do Oracle Instant Client"
        fi
    else
        echo "⚠️ Arquivo instantclient-basic.zip não encontrado"
    fi
else
    echo "🏠 Ambiente local detectado"
fi

echo "🔨 Executando build do Next.js..."
npx next build

echo "✅ Build concluído!"
