// Este arquivo serve como ponto de entrada para a Vercel
// Ele configura corretamente o servidor Express para servir a aplicação

// Importar as dependências necessárias
const express = require('express');
const path = require('path');
const fs = require('fs');

// Criar a aplicação Express
const app = express();

// Configurar CORS para permitir requisições de qualquer origem
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Responder imediatamente a requisições OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Servir arquivos estáticos da pasta dist (onde o Vite coloca o build)
app.use(express.static(path.join(__dirname, 'dist')));

// Rota para verificar se o servidor está funcionando
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Para todas as outras rotas não API, enviar o index.html (para SPA)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Index.html não encontrado. Certifique-se de que o build foi executado corretamente.');
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Exportar a aplicação para uso pela Vercel
module.exports = app;