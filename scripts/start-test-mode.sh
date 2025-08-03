#!/bin/bash

echo "🧪 INICIANDO APLICAÇÃO EM MODO TESTE"
echo "===================================="
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado"
    echo "   Execute este script na raiz do projeto"
    exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js primeiro."
    exit 1
fi

echo "✅ Node.js $(node --version) encontrado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale npm primeiro."
    exit 1
fi

echo "✅ npm $(npm --version) encontrado"
echo ""

# Configurar variáveis de ambiente para teste
export NODE_ENV=development
export DEBUG=true
export NEXT_PUBLIC_BASE_URL=http://localhost:3000

echo "🔧 CONFIGURAÇÕES DE TESTE:"
echo "- NODE_ENV: $NODE_ENV"
echo "- DEBUG: $DEBUG"
echo "- BASE_URL: $NEXT_PUBLIC_BASE_URL"
echo ""

# Verificar se .env.local existe
if [ ! -f ".env.local" ]; then
    echo "📝 Criando .env.local para teste..."
    cat > .env.local << 'EOF'
# 🧪 CONFIGURAÇÃO PARA TESTE LOCAL
NODE_ENV=development
DEBUG=true

# URL base para desenvolvimento
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe Configuration (TESTE)
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_51Gl5lIECNj29EPC97vaR44zfI1IaHS5MY0aKOCIt86Vbtc2SJXkxoev6Ebn6LO9ioCjbpeFojFc8I3J7fAy8ncgF00yhUbLzSg
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
EOF
    echo "✅ .env.local criado com configurações de teste"
else
    echo "✅ .env.local já existe"
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo "✅ Dependências instaladas"
else
    echo "✅ Dependências já instaladas"
fi

echo ""
echo "🚀 INICIANDO SERVIDOR DE DESENVOLVIMENTO..."
echo "=========================================="
echo ""
echo "📍 URLs Disponíveis:"
echo "   🏠 App Principal:     http://localhost:3000"
echo "   🧪 Test Runner:       http://localhost:3000/test-runner"
echo "   🔧 Debug Stripe:      http://localhost:3000/debug-stripe"
echo "   📊 Test Status:       http://localhost:3000/test-status"
echo "   🌍 Test Mode:         http://localhost:3000/test-mode"
echo ""
echo "⚙️  Configurações:"
echo "   💳 Product ID (Test): prod_SnibIHbIfakhda"
echo "   💰 Preço:            R$ 4,00"
echo "   🔒 Ambiente:         TESTE/LOCAL"
echo ""
echo "⏹️  Para parar: Ctrl+C"
echo "🔄 Para reiniciar: npm run dev"
echo ""
echo "=========================================="

# Iniciar o servidor
npm run dev
