#!/bin/bash

echo "🧪 Iniciando aplicação em modo teste..."
echo "=================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale npm primeiro."
    exit 1
fi

echo "✅ Node.js $(node --version) encontrado"
echo "✅ npm $(npm --version) encontrado"
echo ""

# Verificar se package.json existe
if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado. Criando estrutura básica..."
    
    # Criar package.json básico
    cat > package.json << 'EOF'
{
  "name": "relacionamento-quiz",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "npm run dev"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "stripe": "^14.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
EOF
    echo "✅ package.json criado"
fi

# Verificar se .env.local existe
if [ ! -f ".env.local" ]; then
    echo "📝 Criando arquivo .env.local..."
    
    cat > .env.local << 'EOF'
# 🧪 CONFIGURAÇÃO PARA TESTE LOCAL
NODE_ENV=development

# URL base para desenvolvimento
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe Configuration (TESTE)
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_51Gl5lIECNj29EPC97vaR44zfI1IaHS5MY0aKOCIt86Vbtc2SJXkxoev6Ebn6LO9ioCjbpeFojFc8I3J7fAy8ncgF00yhUbLzSg
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Debug mode
DEBUG=true
EOF
    echo "✅ .env.local criado com chaves de teste"
else
    echo "✅ .env.local já existe"
fi

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo "✅ Dependências instaladas"
else
    echo "✅ Dependências já instaladas"
fi

echo ""
echo "🚀 Iniciando servidor de desenvolvimento..."
echo "=================================="
echo "📍 URL Local: http://localhost:3000"
echo "🧪 Modo Teste: http://localhost:3000/test-mode"
echo "🔧 Debug Stripe: http://localhost:3000/debug-stripe"
echo ""
echo "⏹️  Para parar o servidor: Ctrl+C"
echo "=================================="
echo ""

# Iniciar o servidor de desenvolvimento
npm run dev
