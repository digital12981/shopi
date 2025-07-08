// Arquivo de entrada para o deploy na Vercel
import express from 'express';
import cors from 'cors';
import { registerRoutes } from './server/routes';

// Cria a aplicação Express
const app = express();

// Configuração básica de CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para JSON
app.use(express.json());

// Log para solicitações
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Registra as rotas do servidor
registerRoutes(app).then(() => {
  console.log('Rotas registradas com sucesso');
}).catch((error) => {
  console.error('Erro ao registrar rotas:', error);
});

// Middleware para servir arquivos estáticos
app.use(express.static('dist'));

// Handler para todas as outras rotas - serve o index.html para rotas do frontend (SPA)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile('dist/index.html', { root: '.' });
  }
});

// Exporta a aplicação para uso pela Vercel
export default app;