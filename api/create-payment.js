// API para processamento de pagamentos com For4Payments
import fetch from 'node-fetch';

export default async (req, res) => {
  // Configurar CORS para esta rota
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Responder a requisição de preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Verificar se é uma requisição POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      name,
      email,
      cpf,
      phone,
      amount,
      items
    } = req.body;
    
    // Validação básica dos campos obrigatórios
    if (!name || !email || !cpf || !amount) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios ausentes', 
        message: 'Nome, email, CPF e valor são obrigatórios' 
      });
    }
    
    // Validação do CPF (apenas formato básico)
    const cpfClean = cpf.replace(/[^\d]/g, '');
    if (cpfClean.length !== 11) {
      return res.status(400).json({ error: 'CPF inválido' });
    }
    
    // Validação do email (formato básico)
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    // Obter a chave da API do ambiente
    const secretKey = process.env.VITE_FOR4PAYMENTS_SECRET_KEY || process.env.FOR4PAYMENTS_SECRET_KEY;
    
    if (!secretKey) {
      return res.status(500).json({ 
        error: 'Configuração de API ausente', 
        message: 'Chave da API For4Payments não configurada' 
      });
    }
    
    // Preparar os dados para a API For4Payments
    const paymentData = {
      customer: {
        name,
        email,
        cpf: cpfClean,
        phone: phone ? phone.replace(/\D/g, '') : undefined
      },
      amount: Math.round(amount * 100), // Convertendo para centavos conforme exigido pela API
      products: items || [
        {
          title: "Kit de Segurança EPI",
          quantity: 1,
          unitPrice: Math.round(amount * 100),
          tangible: true
        }
      ]
    };
    
    // Chamar a API For4Payments
    const apiUrl = 'https://app.for4payments.com.br/api/v1/pix/payment';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': secretKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na API For4Payments:', errorText);
      throw new Error(`Erro ao processar pagamento: ${response.status} - ${errorText}`);
    }
    
    const paymentResponse = await response.json();
    
    // Estruturar a resposta para o cliente
    const responseData = {
      id: paymentResponse.id,
      pixCode: paymentResponse.pix.qrCode.text,
      pixQrCode: paymentResponse.pix.qrCode.image,
      status: paymentResponse.status
    };
    
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    res.status(500).json({ 
      error: 'Erro ao processar pagamento',
      message: error.message
    });
  }
};