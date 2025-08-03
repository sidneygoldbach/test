#!/bin/bash

echo "🚀 Configurando ambiente local para teste..."

# 1. Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 2. Criar arquivo .env.local se não existir
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    cp .env.example .env.local
fi

echo "✅ Configuração local concluída!"
echo ""
echo "🔧 Próximos passos:"
echo "1. Configure as variáveis em .env.local"
echo "2. Execute: npm run dev"
echo "3. Acesse: http://localhost:3000"
