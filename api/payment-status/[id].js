// API específica para verificar o status de um pagamento
import fetch from 'node-fetch';

export default async (req, res) => {
  // Configurar CORS para esta rota
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Responder a requisição de preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Verificar se é uma requisição GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Extrair o ID do pagamento da URL
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID de pagamento inválido' });
    }
    
    // Obter a chave da API do ambiente
    const secretKey = process.env.VITE_FOR4PAYMENTS_SECRET_KEY || process.env.FOR4PAYMENTS_SECRET_KEY;
    
    if (!secretKey) {
      return res.status(500).json({ 
        error: 'Configuração de API ausente', 
        message: 'Chave da API For4Payments não configurada' 
      });
    }
    
    // Consultar a API For4Payments para verificar o status
    const apiUrl = `https://app.for4payments.com.br/api/v1/transaction/getPayment?id=${id}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': secretKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na consulta de status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Retorna os dados da transação
    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    res.status(500).json({ 
      error: 'Erro ao verificar status do pagamento',
      message: error.message
    });
  }
};