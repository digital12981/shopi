#!/bin/bash

# Script para auxiliar o build na plataforma Vercel

echo "Iniciando o processo de build para a Vercel..."

# Executar o build normalmente
echo "Executando o build do frontend e backend..."
npm run build

# Verificar se o diretório dist foi criado
if [ ! -d "dist" ]; then
  echo "Erro: Diretório 'dist' não foi criado durante o build!"
  exit 1
fi

# Garantir que o diretório está configurado corretamente
echo "Configurando a estrutura de diretórios para a Vercel..."
if [ ! -f "dist/index.html" ]; then
  echo "Erro: O arquivo index.html não está presente na pasta dist!"
  exit 1
fi

# Criar um arquivo _redirects para garantir que rotas SPA funcionem corretamente
echo "/* /index.html 200" > dist/_redirects
echo "Arquivo de redirecionamento criado com sucesso."

echo "Build concluído com sucesso! A aplicação está pronta para deploy na Vercel."