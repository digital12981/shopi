// Servidor Express adaptado para a Vercel
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Criar o aplicativo Express
const app = express();

// Configurar CORS para permitir requisições de qualquer origem
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsing de JSON
app.use(express.json());

// Rota para verificar se a API está funcionando
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API funcionando corretamente na Vercel',
    timestamp: new Date().toISOString()
  });
});

// Rota para verificar o status do IP
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

// Rota para obter informações de veículos
app.get('/api/vehicle-info/:placa', async (req, res) => {
  try {
    const { placa } = req.params;
    
    if (!placa) {
      return res.status(400).json({ error: 'Placa não fornecida' });
    }
    
    const apiKey = process.env.VEHICLE_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Chave da API de veículos não configurada',
        message: 'Entre em contato com o administrador'
      });
    }
    
    // Chamada para o backend Heroku que já existe
    const response = await axios.get(
      `https://disparador-f065362693d3.herokuapp.com/api/vehicle-info/${placa}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return res.json(response.data);
  } catch (error) {
    console.error('Erro ao consultar informações do veículo:', error.message);
    res.status(500).json({ 
      error: 'Erro ao consultar informações do veículo',
      message: error.message
    });
  }
});

// Rota para criar um pagamento PIX
app.post('/api/create-payment', async (req, res) => {
  try {
    const {
      name,
      email,
      cpf,
      phone,
      amount,
      items
    } = req.body;
    
    // Validação básica
    if (!name || !email || !cpf || !amount) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios ausentes',
        message: 'Nome, email, CPF e valor são obrigatórios'
      });
    }
    
    // Secret key da For4Payments
    const secretKey = process.env.VITE_FOR4PAYMENTS_SECRET_KEY || process.env.FOR4PAYMENTS_SECRET_KEY;
    
    if (!secretKey) {
      return res.status(500).json({ 
        error: 'Chave da API For4Payments não configurada',
        message: 'Entre em contato com o administrador'
      });
    }
    
    // Preparar payload
    const cpfClean = cpf.replace(/\\D/g, '');
    const phoneClean = phone ? phone.replace(/\\D/g, '') : generateRandomPhone();
    const amountInCents = Math.round(amount * 100);
    
    const payload = {
      name: name,
      email: email,
      cpf: cpfClean,
      phone: phoneClean,
      paymentMethod: "PIX",
      amount: amountInCents,
      items: items || [{
        title: "Kit de Segurança Shopee",
        quantity: 1,
        unitPrice: amountInCents,
        tangible: true
      }]
    };
    
    // Chamar a API For4Payments
    const response = await axios.post(
      'https://app.for4payments.com.br/api/v1/transaction.purchase',
      payload,
      {
        headers: {
          'Authorization': secretKey,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extrair dados de resposta
    const responseData = response.data;
    let pixCode = null;
    let pixQrCode = null;
    
    // Verificar em vários possíveis formatos de resposta
    if (responseData.pixCode) pixCode = responseData.pixCode;
    else if (responseData.copy_paste) pixCode = responseData.copy_paste;
    else if (responseData.code) pixCode = responseData.code;
    else if (responseData.pix_code) pixCode = responseData.pix_code;
    else if (responseData.pix?.code) pixCode = responseData.pix.code;
    
    if (responseData.pixQrCode) pixQrCode = responseData.pixQrCode;
    else if (responseData.qr_code_image) pixQrCode = responseData.qr_code_image;
    else if (responseData.qr_code) pixQrCode = responseData.qr_code;
    else if (responseData.pix_qr_code) pixQrCode = responseData.pix_qr_code;
    else if (responseData.pix?.qrCode) pixQrCode = responseData.pix.qrCode;
    
    // Fornecer resposta ao cliente
    res.json({
      id: responseData.id || responseData.transactionId || `tx_${Date.now()}`,
      pixCode: pixCode,
      pixQrCode: pixQrCode || '',
      status: responseData.status || 'pending'
    });
  } catch (error) {
    console.error('Erro ao processar pagamento:', error.message);
    res.status(500).json({ 
      error: 'Erro ao processar pagamento',
      message: error.message
    });
  }
});

// Rota para verificar status de pagamento
app.get('/api/payment-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID de pagamento não fornecido' });
    }
    
    const secretKey = process.env.VITE_FOR4PAYMENTS_SECRET_KEY || process.env.FOR4PAYMENTS_SECRET_KEY;
    
    if (!secretKey) {
      return res.status(500).json({ 
        error: 'Chave da API For4Payments não configurada',
        message: 'Entre em contato com o administrador'
      });
    }
    
    const response = await axios.get(
      `https://app.for4payments.com.br/api/v1/transaction.getPayment?id=${id}`,
      {
        headers: {
          'Authorization': secretKey,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error.message);
    res.status(500).json({ 
      error: 'Erro ao verificar status do pagamento',
      message: error.message
    });
  }
});

// Rota para buscar as regiões/estados
app.get('/api/regions', (req, res) => {
  // Dados estáticos para exemplo (na Vercel, isso seria conectado ao banco de dados)
  const regions = [
    { name: "Acre", abbr: "AC", vacancies: 5 },
    { name: "Alagoas", abbr: "AL", vacancies: 10 },
    { name: "Amapá", abbr: "AP", vacancies: 3 },
    { name: "Amazonas", abbr: "AM", vacancies: 15 },
    { name: "Bahia", abbr: "BA", vacancies: 25 },
    { name: "Ceará", abbr: "CE", vacancies: 20 },
    { name: "Distrito Federal", abbr: "DF", vacancies: 22 },
    { name: "Espírito Santo", abbr: "ES", vacancies: 15 },
    { name: "Goiás", abbr: "GO", vacancies: 18 }
  ];
  
  res.json(regions);
});

// Função para gerar telefone aleatório quando não fornecido
function generateRandomPhone() {
  const ddd = Math.floor(Math.random() * (99 - 11 + 1) + 11).toString();
  const number = Math.floor(Math.random() * 999999999).toString().padStart(9, "0");
  return `${ddd}${number}`;
}

// Exportar o handler para o ambiente serverless da Vercel
module.exports = (req, res) => {
  // Vamos iniciar o que seria o path base
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  
  // Remapear o path para o formato que o Express espera
  req.url = path;
  
  return app(req, res);
};