// API específica para verificar dispositivos
import { db } from '../../server/db.js';
import { bannedDevices } from '@shared/schema';
import { eq } from 'drizzle-orm';

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
    // Extrair o ID do dispositivo da URL
    const { deviceId } = req.query;
    
    if (!deviceId || typeof deviceId !== 'string') {
      return res.status(400).json({ error: 'ID de dispositivo inválido' });
    }
    
    // Verificar se o dispositivo está banido no banco de dados
    const [bannedDevice] = await db
      .select()
      .from(bannedDevices)
      .where(eq(bannedDevices.deviceId, deviceId));
    
    if (bannedDevice) {
      res.status(403).json({
        status: 'banned',
        message: 'Dispositivo banido por violação de acesso',
        reason: bannedDevice.banReason || 'Violação de termos de uso',
        deviceId: deviceId
      });
    } else {
      res.status(200).json({
        status: 'allowed',
        message: 'Dispositivo não está banido',
        deviceId: deviceId
      });
    }
  } catch (error) {
    console.error('Erro ao verificar status do dispositivo:', error);
    res.status(500).json({ 
      error: 'Erro interno ao verificar status do dispositivo',
      message: error.message
    });
  }
};