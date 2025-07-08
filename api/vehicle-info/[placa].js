// API específica para consulta de veículos por placa
import fetch from 'node-fetch';

// Cache em memória para resultados de consultas (reduz uso da API externa)
const vehicleCache = new Map();

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
    // Extrair a placa da URL
    const { placa } = req.query;
    
    if (!placa || typeof placa !== 'string') {
      return res.status(400).json({ error: 'Placa inválida' });
    }
    
    // Formatar a placa para o formato adequado (letras maiúsculas, sem espaços)
    const placaFormatada = placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Verificar se a placa tem o formato válido
    if (!placaFormatada || placaFormatada.length < 6 || placaFormatada.length > 8) {
      return res.status(400).json({ error: 'Formato de placa inválido' });
    }
    
    // Verificar se a resposta está no cache
    if (vehicleCache.has(placaFormatada)) {
      return res.status(200).json(vehicleCache.get(placaFormatada));
    }
    
    // Obter a chave da API do ambiente
    const apiKey = process.env.VEHICLE_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Configuração de API ausente', 
        message: 'Chave da API de veículos não configurada' 
      });
    }
    
    // Consultar a API externa
    const apiUrl = `https://disparador-f065362693d3.herokuapp.com/api/vehicle-info/${placaFormatada}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na consulta: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Adicionar ao cache
    vehicleCache.set(placaFormatada, data);
    
    // Limitar o tamanho do cache (opcional)
    if (vehicleCache.size > 1000) {
      const firstKey = vehicleCache.keys().next().value;
      vehicleCache.delete(firstKey);
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao consultar informações do veículo:', error);
    res.status(500).json({ 
      error: 'Erro ao consultar informações do veículo',
      message: error.message
    });
  }
};