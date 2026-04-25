#!/bin/bash
# Script de inicialização automática do TAKESHI BOT

echo "🔄 Limpando sessão antiga..."
rm -rf session

echo "📦 Atualizando pacotes..."
npm install
npm audit fix --force
npm install @adiwajshing/baileys@latest

echo "🚀 Iniciando TAKESHI BOT..."
npm start