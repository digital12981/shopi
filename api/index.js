// API principal para a Vercel
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

// Criar aplicação Express
const app = express();

// Configurar CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para JSON
app.use(express.json());

// Endpoint de teste para verificar se a API está funcionando
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Endpoint para verificação de status de IP
app.get('/api/check-ip-status', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || 
                 req.connection.remoteAddress || 
                 '0.0.0.0';
  
  res.json({
    status: 'allowed',
    message: 'IP não está banido',
    ip: clientIp
  });
});

// Função manipuladora para serverless no ambiente Vercel
export default async function handler(req, res) {
  // Verificar se estamos na Vercel
  if (req.url) {
    // Repassar a requisição para o Express
    return app(req, res);
  }

  // Código para ambiente local (desenvolvimento)
  const server = createServer(app);
  server.listen(3000, () => {
    console.log('Servidor Express rodando na porta 3000');
  });
}