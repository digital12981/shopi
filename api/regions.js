// API para listar regiões/estados disponíveis
import { db } from '../server/db.js';
import { states } from '@shared/schema';

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
    // Consultar o banco de dados para obter os estados
    const statesList = await db
      .select()
      .from(states)
      .orderBy(states.name);
    
    res.status(200).json(statesList);
  } catch (error) {
    console.error('Erro ao obter lista de regiões:', error);
    res.status(500).json({ 
      error: 'Erro ao obter lista de regiões',
      message: error.message
    });
  }
};