#!/bin/bash

echo "=========================================="
echo "   XUNTOS - Plataforma de Colaboración"
echo "=========================================="
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non está instalado."
    echo "   Por favor, instala Node.js desde https://nodejs.org"
    exit 1
fi

echo "✅ Node.js detectado: $(node --version)"
echo ""

# Instalar dependencias se non están instaladas
if [ ! -d "servidor/node_modules" ]; then
    echo "📦 Instalando dependencias do servidor..."
    cd servidor
    npm install
    cd ..
    echo ""
fi

# Iniciar o servidor
echo "🚀 Iniciando servidor..."
echo ""
cd servidor
node server.js
