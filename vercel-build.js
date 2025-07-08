// Script para preparar o build para a Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Executa o build usando os scripts do package.json
console.log('Executando build para a Vercel...');

try {
  // Executa o comando de build padrão
  console.log('Construindo o frontend e o backend...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Cria um arquivo _middleware.js na pasta api para lidar com CORS
  console.log('Configurando middleware para CORS...');
  const middlewareContent = `
// Middleware para lidar com CORS nas funções serverless da Vercel
export default function middleware(req, res) {
  // Adicionar headers CORS para todas as respostas
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  
  // Responder imediatamente para requisições OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return { done: true };
  }
  
  return { done: false };
}
  `;
  
  if (!fs.existsSync('api')) {
    fs.mkdirSync('api');
  }
  
  fs.writeFileSync('api/_middleware.js', middlewareContent);
  console.log('Middleware para CORS configurado com sucesso');
  
  // Cria um arquivo de configuração para servir o SPA corretamente
  console.log('Configurando suporte para Single Page Application...');
  const vercelConfigContent = `{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/(.*)", "destination": "/" }
  ]
}`;
  
  fs.writeFileSync('vercel.json', vercelConfigContent);
  console.log('Configuração para SPA concluída');
  
  console.log('Build concluído com sucesso!');
} catch (error) {
  console.error('Erro durante o build:', error.message);
  process.exit(1);
}